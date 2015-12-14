Template.ForgotPassword.events({
  'click a': function (e) {
    e.preventDefault();

    let email = $(e.target).closest('form').find('input#email').val().trim();

    if (!email) {
      Session.set('login-error', 'error shake');
      setTimeout(() => {
        Session.set('login-error', '');
      }, 1000);
      Materialize.toast('Enter your email address', 5000);
      return;
    }

    Meteor.call('forgot-password', email, function(error ,res) {
      if (error) {
        Session.set('login-error', 'error shake');
        setTimeout(() => {
          Session.set('login-error', '');
        }, 1000);

        //TODO remove log
        console.log(error);

        Materialize.toast(error.reason, 5000);
      }
      else {
        Materialize.toast('You should receive an email with a link to reset your password shortly', 5000, 'success');
      }
    });
  }
});
