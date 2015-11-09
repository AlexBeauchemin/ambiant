Meteor.methods({
  chargeCard: function(stripeToken, amount) {
    let Stripe = new StripeAPI(App.config.stripeApiKey);

    //Taken from http://stackoverflow.com/questions/26226583/meteor-proper-use-of-meteor-wrapasync-on-server
    //TODO: Find a way to return the error, the catch->throw doesn't seems to work

    try {
      let charge = Meteor.wrapAsync(Stripe.charges.create, Stripe.charges);
      charge({
        amount: amount,
        currency: 'usd',
        source: stripeToken
      });

      return true;
    }
    catch(error){
      throw new Meteor.Error(error.message);
    }
  }
});