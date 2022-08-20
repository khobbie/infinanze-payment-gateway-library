/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async ({ view }) => {
  return view.render('start')
})

Route.get("/pay/:payment_id", "PaymentGatwayController.checkout");

Route.get("/confirmation/:payment_id", "PaymentGatwayController.confirmation");


Route.get("/getToken", "PaymentGatwayController.getToken");
Route.post("/post-transaction", "PaymentGatwayController.receiveTransaction");

// Route.get('/getToken', async ({  response }) => {
//   return response.status(200).json({
//     'status': false,
//     'message': "Request validation errors",
//     'hasErrors': true,
//     'data': Env.get['BRAINTREE_MERCHANT_ID']
//   })
// })
