ServiceConfiguration.configurations.remove({
  service: "twitch"
});

ServiceConfiguration.configurations.insert({
  service: "twitch",
  clientId: App.config.twitchClientId,
  redirectUri: Meteor.absoluteUrl() + '_oauth/twitch?close',
  secret: App.config.twitchClientSecret
});

Meteor.publish("user-data", function () {
  return Meteor.users.find({_id: this.userId},
    {fields: {services: 1}});
});

Meteor.users.deny({
  update: function () {
    return true;
  }
});

Meteor.methods({
  'forgot-password': function (email) {
    let user = Accounts.findUserByEmail(email);

    if (!user) throw new Meteor.Error(500, 'Sorry, there is no user with this email address');

    Accounts.sendResetPasswordEmail(user._id);
  }
});

