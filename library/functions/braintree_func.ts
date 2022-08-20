
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

async function receiveTransaction(payload, response, session) {


  var status = ""
  var transaction_id = ""
  var transaction_response = ""
  var transaction_response_message = ""

  // Get Braintress token
  await Braintree.transaction(payload.amount, "fake-valid-nonce", "")
    .then((res) => {

      status = res.success ? "SUCCESS" : "FAILED";
      transaction_response = res.transaction ?? res
      transaction_id = res.transaction.id ? res.transaction.id : ""


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


  var data = {
    status: status,
    amount: payload.amount,
    currency: payload.currency,
    customer_name: payload.fullname,
    transaction_id: transaction_id,
    payment_id: payload.payment_id,
    response: JSON.stringify(transaction_response)
  }

  await DB.table('transactions')
    .insert(
      data
    )


  session.flash('TransactionConformation', JSON.stringify( data))


  console.log("redirection to confirmation page");
  response.redirect().toPath('/confirmation/' + payload.payment_id)


  /*
  // JSON Reponse
    return response.status(200).json({
      'status': status,
      'message': "Transaction status",
      'data': transaction_response
    })
*/


}

export default { getClientToken, receiveTransaction }
