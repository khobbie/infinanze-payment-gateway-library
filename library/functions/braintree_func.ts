
import DB from '@ioc:Adonis/Lucid/Database'
import Braintree from '../../library/gatways/braintree';

async function getClientToken(response) {
  // Get Braintress token
  await Braintree.generateClientToken()
    .then((res) => {
      console.log(res.clientToken);
      return response.status(200).json({
        'status': true,
        'message': "client token generated successfully",
        'data': res.clientToken
      })
    })
    .catch((err) => {
      console.log(err.message);
      return response.status(200).json({
        'status': false,
        'message': err.message,
        'data': null
      })
    })


}

async function receiveTransaction(payload, response) {
/*
  try {
   await DB.table('transactions')
    .insert(
      {
        amount: payload.amount,
        currency: payload.currency,
        customer_name: payload.fullname,
      }
    )
  } catch (error) {
    error.message
  }

// console.log(payload.amount);
return;
 */

  // Get Braintress token
  await Braintree.transaction(payload.amount, "fake-valid-nonce", "")
    .then((res) => {
      if (res.success == true) {


        // Save transaction into transaction table (Database)
      let user =  DB.table('transactions')
          .insert(
            {
              amount: payload.amount,
              currency: payload.currency,
              customer_name: payload.fullname,
            }
          )



        return response.status(200).json({
          'status': res.success,
          'message': "Transaction completed successfully",
          'data': res.trnsaction
        })
      } else {
        return response.status(200).json({
          'status': res.success,
          'message': res.message,
          'data': null
        })
      }
      console.log(res); return;
      // return response.status(200).json({
      //   'status': true,
      //   'message': "client token generated successfully",
      //   'data': res.clientToken
      // })
    })
    .catch((err) => {
      console.log(err.message); return;
      // return response.status(200).json({
      //   'status': false,
      //   'message': err.message,
      //   'data': null
      // })
    })


}

export default { getClientToken, receiveTransaction }
