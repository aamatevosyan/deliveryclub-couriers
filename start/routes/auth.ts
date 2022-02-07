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
      Route.get('/', 'AuthPhoneCodeController.create').as('create')

      Route.post('/', 'AuthPhoneCodeController.store').as('store')

      Route.post('/resend-code', 'AuthPhoneCodeController.resend').as('resend-code')

      Route.get('/validate/:uuid', 'AuthPhoneCodeController.show')
        .where('uuid', uuid())
        .as('validate.show')

      Route.delete('/validate/:uuid', 'AuthPhoneCodeController.destroy')
        .where('uuid', uuid())
        .as('validate.destroy')
    })
      .as('phone')
      .prefix('phone')

    Route.get('/:step/:uuid', 'RegisterController.show')
      .where('uuid', uuid())
      .where('step', {
        match: /^[1-2]+$/,
        cast: (id) => Number(id),
      })
      .as('step.show')

    Route.post('/:step/:uuid', 'RegisterController.store')
      .where('uuid', Route.matchers.uuid())
      .where('step', {
        match: /^[1-2]+$/,
        cast: (id) => Number(id),
      })
      .as('step.store')
  })
    .as('register')
    .prefix('register')
})
  .as('auth')
  .prefix('auth')
  .namespace('App/Controllers/Http/Auth')
