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
  }
});