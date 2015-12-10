Template.modalLogin.events({
  "submit form": function(e) {
    e.preventDefault();

    let email = e.target.email.value,
      password = e.target.password.value;

    App.helpers.login(email, password, (error) => {
      if (error) {
        Session.set('login-error', 'error shake');
        setTimeout(() => {
          Session.set('login-error', '');
        }, 1000);
      }
      else $('#modal-login').closeModal();
    });
  },
  'click [data-action="login-twitch"]': function(e) {
    e.preventDefault();

    App.helpers.loginWithTwitch(() => {
      $('#modal-login').closeModal();
    });
  },
  'click [data-action="login-google"]': function(e) {
    Meteor.loginWithGoogle({}, function(err) {
      if (err) return Materialize.toast(err.message, 5000);
      $('#modal-login').closeModal();
    });
  },
  'click [data-action="login-facebook"]': function(e) {
    Meteor.loginWithFacebook({}, function(err) {
      if (err) return Materialize.toast(err.message, 5000);
      $('#modal-login').closeModal();
    });
  }
});