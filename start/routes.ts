

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})

Route.group(() => {
  Route.post('/create', 'CustomWordController.store')
  Route.get('/get-all', 'CustomWordController.getAll')
  Route.get('/get-one/:id', 'CustomWordController.getOne')
  Route.put('/update-one/:id', 'CustomWordController.updateOne')
  Route.delete('/delete-one/:id', 'CustomWordController.deleteOne')
}).prefix('/custom-word').middleware("auth");

Route.group(() => {
  Route.post("/login", "AuthController.login");
  Route.post("/logout", "AuthController.logout").middleware("auth");
}).prefix("/auth");
