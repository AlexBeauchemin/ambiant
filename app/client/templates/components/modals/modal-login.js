Template.modalLogin.events({
  "submit form": function (e) {
    e.preventDefault();

    let email = event.target.email.value,
      password = event.target.password.value;

    App.helpers.login(email, password, (error) => {
      if (error) Session.set('login-error', 'error shake');
      else $('#modal-login').closeModal();
    });
  },
  'click [data-action="login-twitch"]': function (e) {
    e.preventDefault();

    App.helpers.loginWithTwitch(() => {
      $('#modal-login').closeModal();
    });
  }
});