import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Route from '@ioc:Adonis/Core/Route'
import Cache from '@ioc:Adonis/Addons/Adonis5-Cache'
import { DateTime, Duration } from 'luxon'
import Bull from '@ioc:Rocketseat/Bull'
import DCCConfig from 'Config/dcc'
import { ValidationException } from '@ioc:Adonis/Core/Validator'
import SendCodeByPhoneValidator from 'App/Validators/SendCodeByPhoneValidator'
import SendCodeByPhone from 'App/Jobs/SendCodeByPhone'
import ConfirmPhoneCodeValidator from 'App/Validators/ConfirmPhoneCodeValidator'
import ResendCodeByPhoneValidator from 'App/Validators/ResendCodeByPhoneValidator'

async function getUser(uuid: string) {
  return await User.query().where('uuid', uuid).where('status', User.STATUS_INACTIVE).firstOrFail()
}

export default class AuthPhoneCodeController {
  public async create({ request, inertia }: HttpContextContract) {
    const uuid = request.param('uuid')

    return inertia.render('Auth/Phone/Register', { uuid })
  }

  public async store({ request, response }: HttpContextContract) {
    const uuid = request.param('uuid')
    const user: User = await getUser(uuid)

    const payload = await request.validate(SendCodeByPhoneValidator)
    const phone = payload.phone

    if (user.phone) {
      return response.redirect(Route.makeUrl('auth.register.finalize', { uuid }))
    }

    const cacheKey = `auth.sendcode.phone.${uuid}`

    await Cache.put(
      cacheKey,
      {
        phone: phone,
        ttl: DateTime.now()
          .plus(Duration.fromObject({ milliseconds: DCCConfig.auth.phone.timeouts.resend }))
          .toMillis(),
        code: null,
      },
      DCCConfig.auth.phone.timeouts.code
    )

    await Bull.add(new SendCodeByPhone().key, { phone, uuid })

    return response.redirect(Route.makeUrl('auth.register.phone.validate.show', { uuid }))
  }

  public async show({ request, response, inertia }: HttpContextContract) {
    const uuid = request.param('uuid')
    await getUser(uuid)
    const cacheKey = `auth.sendcode.phone.${uuid}`
    const cacheData = await Cache.get(cacheKey)

    if (!cacheData) {
      return response.redirect(Route.makeUrl('auth.register.phone.create', { uuid }))
    }

    const expires = Math.max(cacheData.ttl - DateTime.now().toMillis(), 0)
    const phone = cacheData.phone

    return inertia.render('Auth/Phone/VerifyCode', { uuid, expires, phone })
  }

  public async destroy({ request, response }: HttpContextContract) {
    const uuid = request.param('uuid')
    User = await getUser(uuid)

    const payload = await request.validate(ConfirmPhoneCodeValidator)
    const cacheKey = `auth.sendcode.phone.${uuid}`
    const cacheData = await Cache.get(cacheKey)

    if (
      !cacheData ||
      payload.code != cacheData.code ||
      !Math.max(cacheData.ttl - DateTime.now().toMillis())
    ) {
      throw new ValidationException(false, { code: 'Code expired or invalid' })
    }

    await Cache.forget(cacheKey)

    return response.redirect(Route.makeUrl('auth.register.finalize.show', { uuid }))
  }

  public async resend({ request, response }: HttpContextContract) {
    const uuid = request.param('uuid')
    const user: User = await getUser(uuid)
    const payload = await request.validate(ResendCodeByPhoneValidator)
    const phone = payload.phone

    if (user.phone) {
      return response.redirect(
        Route.makeUrl('auth.register.finalize.show', {
          uuid,
        })
      )
    }

    const cacheKey = `auth.sendcode.phone.${uuid}`
    const cacheData = await Cache.get(cacheKey)

    if (
      !cacheData ||
      request.input('phone') !== cacheData.phone ||
      Math.max(cacheData.ttl - DateTime.now().toMillis(), 0)
    ) {
      return response.redirect(Route.makeUrl('auth.register.phone.create'))
    }

    await Cache.put(
      cacheKey,
      {
        phone: phone,
        ttl: DateTime.now()
          .plus(Duration.fromObject({ milliseconds: DCCConfig.auth.phone.timeouts.resend }))
          .toMillis(),
        code: null,
      },
      DCCConfig.auth.phone.timeouts.code
    )

    await Bull.add(new SendCodeByPhone().key, { phone, uuid })

    return response.redirect(Route.makeUrl('auth.register.finalize.show', { uuid }))
  }
}
