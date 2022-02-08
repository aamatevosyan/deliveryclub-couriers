import Route from '@ioc:Adonis/Core/Route'
import { uuid } from 'App/Misc/matchers'

Route.group(() => {
  Route.get('/login', 'AuthenticatedSessionsController.show').as('login.show')

  Route.post('/login', 'AuthenticatedSessionsController.store').as('login.store')

  Route.delete('/logout', 'AuthenticatedSessionsController.destroy').as('logout')

  Route.group(() => {
    Route.get('/', 'AuthCodeController.create').as('create')

    Route.post('/', 'AuthCodeController.store').as('store')

    Route.post('/resend-code', 'AuthCodeController.resend').as('resend-code')

    Route.get('/validate/:uuid', 'AuthCodeController.show')
      .where('uuid', uuid())
      .as('validate.show')

    Route.delete('/validate/:uuid', 'AuthCodeController.destroy')
      .where('uuid', uuid())
      .as('validate.destroy')

    Route.group(() => {
      Route.get('/:uuid', 'AuthPhoneCodeController.create')
        .where('uuid', uuid())
        .as('create')

      Route.post('/:uuid', 'AuthPhoneCodeController.store')
        .where('uuid', uuid())
        .as('store')

      Route.post('/resend-code/:uuid', 'AuthPhoneCodeController.resend')
        .where('uuid', uuid())
        .as('resend-code')

      Route.get('/validate/:uuid', 'AuthPhoneCodeController.show')
        .where('uuid', uuid())
        .as('validate.show')

      Route.delete('/validate/:uuid', 'AuthPhoneCodeController.destroy')
        .where('uuid', uuid())
        .as('validate.destroy')
    })
      .as('phone')
      .prefix('phone')

    Route.get('/finalize/:uuid', 'RegisterController.show')
      .where('uuid', uuid())
      .as('finalize.show')

    Route.post('/finalize/:uuid', 'RegisterController.store')
      .where('uuid', uuid())
      .as('finalize.store')
  })
    .as('register')
    .prefix('register')
})
  .as('auth')
  .prefix('auth')
  .namespace('App/Controllers/Http/Auth')
