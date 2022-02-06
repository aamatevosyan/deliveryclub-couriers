import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Route from '@ioc:Adonis/Core/Route'
import { v4 as uuidv4 } from 'uuid'
import Cache from '@ioc:Adonis/Addons/Adonis5-Cache'
import { DateTime, Duration } from 'luxon'
import SendCodeByEmail from 'App/Jobs/SendCodeByEmail'
import Bull from '@ioc:Rocketseat/Bull'
import SendCodeByEmailValidator from 'App/Validators/SendCodeByEmailValidator'
import DCCConfig from 'Config/dcc'

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

  public async resend({ request, response }: HttpContextContract) {
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

    const uuid = request.param('uuid')
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
