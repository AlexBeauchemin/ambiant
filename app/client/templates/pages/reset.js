Template.Reset.events({
  "submit form": function (e) {
    e.preventDefault();

    let token = Router.current().params.token,
      password = e.target.password.value.trim().substr(0,255);

    if (!token) {
      Materialize.toast('This token is invalid', 5000);
      return;
    }

    if (!password || password.length < 5) {
      Materialize.toast('Your password is too short', 5000);
      return;
    }

    Accounts.resetPassword(token, password, function(error) {
      if (error) { Materialize.toast('Something wrong happened', 5000); }
      else Router.go('home');
    });
  },
  'click [data-action="login-twitch"]': function (e) {
    e.preventDefault();

    App.helpers.loginWithTwitch(() => {
      $('#modal-register').closeModal();
    });
  }
});