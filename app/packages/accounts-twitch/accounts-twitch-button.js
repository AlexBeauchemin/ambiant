Template.twitchLoginButton.events({
  'click [data-action="login-twitch"]': function (e) {
    e.preventDefault();

    Meteor.loginWithTwitch(function (err) {
      if (err) return console.log(err);
    });
  }
});