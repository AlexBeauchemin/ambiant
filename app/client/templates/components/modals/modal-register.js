Template.modalRegister.events({
  "submit form": function (e) {
    e.preventDefault();

    let email = e.target.email.value,
      password = e.target.password.value,
      name = e.target.name.value;

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