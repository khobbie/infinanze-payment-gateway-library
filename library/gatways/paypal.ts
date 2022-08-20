
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

module.exports = { transaction }

/*
 // usage
let nonceFromTheClient = process.env['BRAINTREE_TRANSATION_TOKEN'];
let deviceDataFromTheClient = "";
let amount = 10.00;
let payment = transaction(amount, nonceFromTheClient, deviceDataFromTheClient);
 
payment
    .then((result) => { console.log(result.transaction);  })
    .catch((err) => { console.log(err.message); })
 
*/




