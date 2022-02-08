// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
//
// import User from 'App/Models/User'
// import Hash from '@ioc:Adonis/Core/Hash'

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Route from '@ioc:Adonis/Core/Route'
import RegisterFinalizeValidator from 'App/Validators/RegisterFinalizeValidator'

async function getUser(uuid: string) {
  return await User.query().where('uuid', uuid).where('status', User.STATUS_INACTIVE).firstOrFail()
}

export default class RegisterController {
  public async show({ request, inertia }: HttpContextContract) {
    const uuid = request.param('uuid')
    await getUser(uuid)

    return inertia.render('Auth/Finalize', { uuid })
  }

  public async store({ request, response }: HttpContextContract) {
    const uuid = request.param('uuid')
    const user: User = await getUser(uuid)

    const payload = await request.validate(RegisterFinalizeValidator)

    await user.merge(payload).save()

    return response.redirect(Route.makeUrl('home'))
  }
}
