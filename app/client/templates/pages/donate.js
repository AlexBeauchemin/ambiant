Template.Donate.rendered = function () {
  $.when(
    $.getScript("https://js.stripe.com/v2/"),
    $.getScript("https://checkout.stripe.com/checkout.js"),
    $.Deferred(function( deferred ){
      $( deferred.resolve );
    })
  ).done(() => {
      Stripe.setPublishableKey(App.config.stripeApiKey);
    });
};

Template.Donate.events({
  'click [data-action="stripe"]': function(e) {
    e.preventDefault();

    let amount = $(e.currentTarget).data('amount');
    let displayAmount = 0;

    if (amount === "custom") {
      amount = $('input[name="amount"]').val();
    }

    displayAmount = parseInt(amount,10);
    amount = displayAmount * 100;

    if (!amount) return;

    StripeCheckout.open({
      key: App.config.stripeApiKey,
      amount: amount,
      name: 'Ambiant',
      description: 'Buy a beer',
      panelLabel: 'Pay Now',
      //image: '/ambiant-logo.png',
      token: function(res) {
        var stripeToken = res.id;
        Meteor.call('chargeCard', stripeToken, amount, function (error, res) {
          if (error) Materialize.toast("Sorry, your donation didn't work", 5000);
          if (!error && res) Materialize.toast(`Thank you for your ${displayAmount}$ donation!`, 3000, 'success');
        });
      }
    });
  }
});
