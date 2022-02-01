import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Route from '@ioc:Adonis/Core/Route'
import { v4 as uuidv4 } from 'uuid'
import Cache from '@ioc:Adonis/Addons/Adonis5-Cache'
import { DateTime, Duration } from 'luxon'
import Config from '@ioc:Adonis/Core/Config'
import SendCodeByEmail from 'App/Jobs/SendCodeByEmail'
import Bull from '@ioc:Rocketseat/Bull'
import SendCodeByEmailValidator from 'App/Validators/SendCodeByEmailValidator'

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

    await Cache.put(
      `auth.sendcode.${uuid}`,
      {
        email: email,
        ttl: DateTime.now()
          .plus(Duration.fromObject({ seconds: Config.get('dcc.authEmailTimeout') }))
          .toISO(),
        code: null,
      },
      1000 * Config.get('dcc.authEmailTimeout')
    )

    await Bull.add(new SendCodeByEmail().key, { email, uuid })

    return response.redirect(Route.makeUrl('auth.register.validate.show', { uuid }))
  }
}
