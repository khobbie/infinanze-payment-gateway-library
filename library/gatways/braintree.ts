import Env from '@ioc:Adonis/Core/Env'
import braintree from "braintree";

// Configuration setup
const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: Env.get('BRAINTREE_MERCHANT_ID'),
  publicKey: Env.get('BRAINTREE_PUBLIC_KEY'),
  privateKey: Env.get('BRAINTREE_PRIVATE_KEY'),
});


// generate payment token
async function generateClientToken() {
  return await gateway.clientToken.generate();
}

/* // usage
let token = generateClientToken();

token
    .then((res) => { console.log(res.clientToken); })
    .catch((err) => { console.log(err.message); })
 */



// receive transaction
const transaction = async function (amount, nonceFromTheClient, deviceDataFromTheClient) {
  // let nonceFromTheClient = await generateClientToken();
  return await gateway.transaction.sale({
    amount: amount,
    paymentMethodNonce: nonceFromTheClient,
    deviceData: deviceDataFromTheClient,
    options: {
      submitForSettlement: true
    }
  });
}



/*
 // usage
let nonceFromTheClient = Env.get['BRAINTREE_TRANSATION_TOKEN'];
let deviceDataFromTheClient = "";
let amount = 10.00;
let payment = transaction(amount, nonceFromTheClient, deviceDataFromTheClient);

payment
    .then((result) => { console.log(result.transaction);  })
    .catch((err) => { console.log(err.message); })

*/


export default { generateClientToken, transaction }

// module.exports = { generateClientToken, transaction }


/*
 // usage
let nonceFromTheClient = Env.get['BRAINTREE_TRANSATION_TOKEN'];
let deviceDataFromTheClient = "";
let amount = 10.00;
let payment = transaction(amount, nonceFromTheClient, deviceDataFromTheClient);

payment
    .then((result) => { console.log(result.transaction);  })
    .catch((err) => { console.log(err.message); })

*/




