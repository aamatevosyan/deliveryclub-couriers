import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import User from 'App/Models/User'
import Hash from '@ioc:Adonis/Core/Hash'

export default class AuthenticatedSessionsController {
  public async store({ auth, request, response }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')
    const rememberMe = !!request.input('rememberMe')

    // Lookup user manually
    const user = await User.query()
      .where('email', email)
      .where('status', User.STATUS_ACTIVE)
      .firstOrFail()

    // Verify password
    if (!(await Hash.verify(user.password, password))) {
      return response.badRequest('Invalid credentials')
    }

    // Create session
    await auth.use('web').login(user, rememberMe)
  }

  
}
