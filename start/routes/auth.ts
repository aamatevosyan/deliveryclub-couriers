import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/login', 'AuthenticatedSessionsController.create').as('login.create')

  Route.post('/login', 'AuthenticatedSessionsController.store').as('login.store')

  Route.delete('/logout', 'AuthenticatedSessionsController.destroy').as('logout')
})
  .as('auth.')
  .prefix('auth')
  .namespace('App/Controllers/Http/Auth')
