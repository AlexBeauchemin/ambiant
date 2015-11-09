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
      $('#modal-registrer').closeModal();
    });
  }
});