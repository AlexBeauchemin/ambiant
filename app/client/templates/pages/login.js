Template.Login.events({
  "submit form": function (e) {
    e.preventDefault();

    let email = event.target.email.value,
      password = event.target.password.value;

    App.helpers.login(email, password, (error) => {
      if (!error) Router.go('home');
    });
  },
  'click [data-action="login-twitch"]': function (e) {
    e.preventDefault();

    App.helpers.loginWithTwitch(() => {
      Router.go('home');
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