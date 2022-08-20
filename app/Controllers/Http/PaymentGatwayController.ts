import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import DB from '@ioc:Adonis/Lucid/Database'
import BraintreeFunctions from '../../../library/functions/braintree_func';
import CardNumberFormat from '../../../library/check_card_type';



export default class PaymentGatwayController {



  public async getToken({ request, response }: HttpContextContract) {

    // Get Braintress token
    return await BraintreeFunctions.getClientToken(response);


  }

  public async checkout({ view, params, response }: HttpContextContract) {
      let payment_id = params.payment_id
    //return payment_id;
      const payment_receipt = await DB
    .from('transactions')
    .where('payment_id', payment_id)

    // if payment id exit redirect to starting page
    if(payment_receipt.toString().trim() == ""){
      return view.render('checkout', {payment_id : params.payment_id})
    }else{
      return response.redirect().toPath('/')
    }


  }


  public async confirmation({ view, params, response }: HttpContextContract) {

    let payment_id = params.payment_id
    //return payment_id;
      const payment_receipt = await DB
    .from('transactions')
    .where('payment_id', payment_id)
    .first()

    // return payment_receipt.status;

    // if payment id exit redirect to starting page
    if(payment_receipt.toString().trim() == ""){
      return response.redirect().toPath('/')

    }else{
      return view.render('confirmation', {payment_receipt: payment_receipt})

    }





  }

  public async receiveTransaction({ request, session, response }: HttpContextContract) {


    // request body validation
    const payload = await request.validate({
      schema: schema.create({

        amount: schema.number(),
        currency: schema.string({ trim: true }),
        fullname: schema.string({ trim: true }),
        cardName: schema.string(),
        cardNumber: schema.number(),
        month: schema.number(),
        year: schema.number(),
        cvv: schema.number(),
        payment_id: schema.string(),
        token: schema.string(),
        /*
                creditCard: schema.object().members({
                  name: schema.string(),
                  number: schema.number(),
                  expirationMonth: schema.number(),
                  expirationYear: schema.number(),
                  cvv: schema.number()
                })
         */
      }),
      messages: {
        required: 'The {{ field }} is required',
        'card_name': 'Card name not available'
      }
    })


    //console.log(payload)

    const card_type = await CardNumberFormat.getCardType(payload.cardNumber);

    if (card_type == "unknown") {
      session.flash('cardError', 'Unknown card type')
      session.flashAll()
      response.redirect().back()
      console.log("Unknown card type");

    }


    // Switch between the payment types
    switch (card_type) {
      case 'amex':

        if (payload.currency != 'USD') {


          session.flash('cardError', 'Card Detected : ' + card_type.toUpperCase() + " | Currency: (" + payload.currency + ") | AMEX is possible to use only for USD")
          session.flashAll()
          response.redirect().back()


          return;
        }

        session.flash('cardDetected', 'Card Detected : ' + card_type.toUpperCase() + " | Currency: (" + payload.currency + ") | PAYPAL(AMEX) PAYMENT GATEWAY")
        session.flashAll()
        console.log("*************************************");
        console.log("PAYPAL(AMEX) PAYMENT GATEWAY - ");
        console.log("*************************************");
        response.redirect().back()

        break;

      // Implement the rest of Payment Gateways
      case 'visa': // VISA CARD

        if (payload.currency == ('USD' || 'EUR' || 'AUD')) {

          session.flash('cardDetected', 'Card Detected : ' + card_type.toUpperCase() + " | Currency: (" + payload.currency + ") | PAYPAL PAYMENT GATEWAY")
          session.flashAll()

          response.redirect().back()



        } else {

          return await BraintreeFunctions.receiveTransaction(payload, response, session);


        }
        return;

        break;
      case 'mastercard': // MASTER CARD

        if (payload.currency == ('USD' || 'EUR' || 'AUD')) {

          session.flash('cardDetected', 'Card Detected : ' + card_type.toUpperCase() + " | Currency: (" + payload.currency + ") | PAYPAL PAYMENT GATEWAY")
          session.flashAll()

          response.redirect().back()



        } else {

          return await BraintreeFunctions.receiveTransaction(payload, response, session);
        }
        return;

        break;
      case 'unionpay': // UNION PAY CARD

        if (payload.currency == ('USD' || 'EUR' || 'AUD')) {

          session.flash('cardDetected', 'Card Detected : ' + card_type.toUpperCase() + " | Currency: (" + payload.currency + ") | PAYPAL PAYMENT GATEWAY")
          session.flashAll()

          response.redirect().back()



        } else {

          return await BraintreeFunctions.receiveTransaction(payload, response, session);

        }
        return;
        break;
      case 'maestro': // MAESTRO CARD

        if (payload.currency == ('USD' || 'EUR' || 'AUD')) {

          session.flash('cardDetected', 'Card Detected : ' + card_type.toUpperCase() + " | Currency: (" + payload.currency + ") | PAYPAL PAYMENT GATEWAY")
          session.flashAll()

          response.redirect().back()



        } else {

          return await BraintreeFunctions.receiveTransaction(payload, response, session);

        }
        return;

        break;
      default:
        break;

    }


    return;


  }
}
