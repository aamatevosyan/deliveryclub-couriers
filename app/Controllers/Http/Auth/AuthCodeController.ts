import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Route from '@ioc:Adonis/Core/Route'
import { v4 as uuidv4 } from 'uuid'
import Cache from '@ioc:Adonis/Addons/Adonis5-Cache'
import { DateTime, Duration } from 'luxon'
import SendCodeByEmail from 'App/Jobs/SendCodeByEmail'
import Bull from '@ioc:Rocketseat/Bull'
import SendCodeByEmailValidator from 'App/Validators/SendCodeByEmailValidator'
import ResendCodeByEmailValidator from 'App/Validators/ResendCodeByEmailValidator'
import ConfirmEmailCodeValidator from 'App/Validators/ConfirmEmailCodeValidator'
import DCCConfig from 'Config/dcc'
import { ValidationException } from '@ioc:Adonis/Core/Validator'
import { uuid4 } from '@sentry/utils'
import Logger from "@ioc:Adonis/Core/Logger";

export default class AuthCodeController {
  public async create({ inertia }: HttpContextContract) {
    return inertia.render('Auth/Register')
  }

  public async store({ request, response }: HttpContextContract) {
    const payload = await request.validate(SendCodeByEmailValidator)
    const email = payload.email

    const user = await User.query()
      .where('email', email)
      .where('status', User.STATUS_ACTIVE)
      .first()

    if (user) {
      return response.redirect(
        Route.makeUrl('auth.register.step.show', {
          step: user.registrationStep,
          uuid: user.uuid,
        })
      )
    }

    const uuid = uuidv4()
    const cacheKey = `auth.sendcode.${uuid}`

    await Cache.put(
      cacheKey,
      {
        email: email,
        ttl: DateTime.now()
          .plus(Duration.fromObject({ milliseconds: DCCConfig.auth.email.timeouts.resend }))
          .toMillis(),
        code: null,
      },
      DCCConfig.auth.email.timeouts.code
    )

    await Bull.add(new SendCodeByEmail().key, { email, uuid })

    return response.redirect(Route.makeUrl('auth.register.validate.show', { uuid }))
  }

  public async show({ request, response, inertia }: HttpContextContract) {
    const uuid = request.param('uuid')
    const cacheKey = `auth.sendcode.${uuid}`
    const cacheData = await Cache.get(cacheKey)

    if (!cacheData) {
      return response.redirect(Route.makeUrl('auth.register.create'))
    }

    const expires = Math.max(cacheData.ttl - DateTime.now().toMillis(), 0)
    const email = cacheData.email

    return inertia.render('Auth/VerifyCode', { uuid, expires, email })
  }

  public async destroy({ request, response }: HttpContextContract) {
    const uuid = request.param('uuid')
    const payload = await request.validate(ConfirmEmailCodeValidator)
    const cacheKey = `auth.sendcode.${uuid}`
    const cacheData = await Cache.get(cacheKey)

    Logger.info(cacheData)

    if (
      !cacheData ||
      payload.code != cacheData.code ||
      !Math.max(cacheData.ttl - DateTime.now().toMillis())
    ) {
      throw new ValidationException(false, { code: 'Code expired or invalid' })
    }

    const user = await User.firstOrCreate({ email: cacheData.email }, { uuid: uuid4() })

    await Cache.forget(cacheKey)

    return response.redirect(Route.makeUrl('auth.register.step', { uuid: user.uuid, step: 1 }))
  }

  public async resend({ request, response }: HttpContextContract) {
    const payload = await request.validate(ResendCodeByEmailValidator)
    const email = payload.email

    const user = await User.query()
      .where('email', email)
      .where('status', User.STATUS_ACTIVE)
      .first()

    if (user) {
      return response.redirect(
        Route.makeUrl('auth.register.step.show', {
          step: user.registrationStep,
          uuid: user.uuid,
        })
      )
    }

    const uuid = payload.uuid
    const cacheKey = `auth.sendcode.${uuid}`
    const cacheData = await Cache.get(cacheKey)

    if (
      !cacheData ||
      request.input('email') !== cacheData.email ||
      Math.max(cacheData.ttl - DateTime.now().toMillis(), 0)
    ) {
      return response.redirect(Route.makeUrl('auth.register.create'))
    }

    await Cache.put(
      cacheKey,
      {
        email: email,
        ttl: DateTime.now()
          .plus(Duration.fromObject({ milliseconds: DCCConfig.auth.email.timeouts.resend }))
          .toMillis(),
        code: null,
      },
      DCCConfig.auth.email.timeouts.code
    )

    await Bull.add(new SendCodeByEmail().key, { email, uuid })

    return response.redirect(Route.makeUrl('auth.register.validate.show', { uuid }))
  }
}
