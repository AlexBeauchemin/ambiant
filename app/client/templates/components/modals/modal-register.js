Template.modalRegister.events({
  "submit form": function (event) {
    event.preventDefault();

    let email = event.target.email.value,
      password = event.target.password.value,
      name = event.target.name.value;

    App.helpers.register(email, password, name, (error) => {
      if (error) Session.set('register-error', 'error shake');
      else $('#modal-register').closeModal();
    });
  },
  'click [data-action="login-twitch"]': function (e) {
    e.preventDefault();

    App.helpers.loginWithTwitch(() => {
      $('#modal-register').closeModal();
    });
  },
  'click [data-action="login-google"]': function(e) {
    Meteor.loginWithGoogle({}, function(err) {
      if (err) return Materialize.toast(err.message, 5000);
      $('#modal-register').closeModal();
    });
  },
  'click [data-action="login-facebook"]': function(e) {
    Meteor.loginWithFacebook({}, function(err) {
      if (err) return Materialize.toast(err.message, 5000);
      $('#modal-register').closeModal();
    });
  }
});