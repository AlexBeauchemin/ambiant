ServiceConfiguration.configurations.remove({
  service: "twitch"
});

ServiceConfiguration.configurations.remove({
  service: "google"
});

ServiceConfiguration.configurations.remove({
  service: "facebook"
});

ServiceConfiguration.configurations.insert({
  service: "twitch",
  clientId: Meteor.settings.private.twitchClientId,
  redirectUri: Meteor.absoluteUrl() + '_oauth/twitch?close',
  secret: Meteor.settings.private.twitchClientSecret
});

ServiceConfiguration.configurations.insert({
  service: "google",
  clientId: Meteor.settings.private.googleClientId,
  redirectUri: Meteor.absoluteUrl() + '/_oauth/google?close',
  secret: Meteor.settings.private.googleSecret
});

ServiceConfiguration.configurations.insert({
  service: "facebook",
  appId: Meteor.settings.private.facebookAppId,
  redirectUri: Meteor.absoluteUrl() + '/_oauth/facebook?close',
  secret: Meteor.settings.private.facebookSecret
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

    Accounts.sendResetPasswordEmail(user._id, email);
  }
});

