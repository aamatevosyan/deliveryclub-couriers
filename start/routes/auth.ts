import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/login', 'AuthenticatedSessionsController.show').as('login.show')

  Route.post('/login', 'AuthenticatedSessionsController.store').as('login.store')

  Route.delete('/logout', 'AuthenticatedSessionsController.destroy').as('logout')

  Route.group(() => {
    Route.get('/register', 'AuthCodeController.create').as('register.create')

    Route.post('/register', 'AuthCodeController.store').as('register.store')

    Route.post('/resend-code', 'AuthCodeController.resend').as('register.resend-code')

    Route.get('/validate/{uuid}', 'AuthCodeController.show')
      .where('uuid', Route.matchers.uuid())
      .as('register.validate.show')

    Route.delete('/validate/{uuid}', 'AuthCodeController.destroy')
      .where('uuid', Route.matchers.uuid())
      .as('register.validate.destroy')

    Route.get('/{step}/{uuid}', 'RegisterController.show')
      .where('uuid', Route.matchers.uuid())
      .where('step', {
        match: /^[1-2]+$/,
        cast: (id) => Number(id),
      })
      .as('register.step.show')

    Route.post('/{step}/{uuid}', 'RegisterController.store')
      .where('uuid', Route.matchers.uuid())
      .where('step', {
        match: /^[1-2]+$/,
        cast: (id) => Number(id),
      })
      .as('register.step.store')
  })
    .as('register.')
    .prefix('register')
})
  .as('auth.')
  .prefix('auth')
  .namespace('App/Controllers/Http/Auth')
