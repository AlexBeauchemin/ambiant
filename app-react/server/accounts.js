import _ from 'lodash';

const twitchClientId = _.get(Meteor.settings, 'private.twitchClientId');
const twitchSecret = _.get(Meteor.settings, 'private.twitchSecret');
const googleClientId = _.get(Meteor.settings, 'private.googleClientId');
const googleSecret = _.get(Meteor.settings, 'private.googleSecret');
const facebookAppId = _.get(Meteor.settings, 'private.facebookAppId');
const facebookSecret = _.get(Meteor.settings, 'private.facebookSecret');

if (!twitchClientId || !twitchSecret) {
  console.warn('Please provide a twitch client id and secret in settings.json');
}
if (!googleClientId || !googleSecret) {
  console.warn('Please provide a google client id and secret in settings.json');
}
if (!facebookAppId || !facebookSecret) {
  console.warn('Please provide a facebook app id and secret in settings.json');
}

ServiceConfiguration.configurations.remove({
  service: 'twitch'
});

ServiceConfiguration.configurations.remove({
  service: 'google'
});

ServiceConfiguration.configurations.remove({
  service: 'facebook'
});

ServiceConfiguration.configurations.insert({
  service: 'twitch',
  clientId: twitchClientId,
  redirectUri: `${Meteor.absoluteUrl()}_oauth/twitch?close`,
  secret: twitchSecret
});

ServiceConfiguration.configurations.insert({
  service: 'google',
  clientId: googleClientId,
  redirectUri: `${Meteor.absoluteUrl()}/_oauth/google?close`,
  secret: googleSecret
});

ServiceConfiguration.configurations.insert({
  service: 'facebook',
  appId: facebookAppId,
  redirectUri: `${Meteor.absoluteUrl()}/_oauth/facebook?close`,
  secret: facebookSecret
});

Meteor.publish(
  'user-data',
  Meteor.users.find({ _id: this.userId }, { fields: { services: 1 } })
);

Meteor.users.deny({
  update() {
    return true;
  }
});

Meteor.methods({
  ['forgot-password'](email) {
    const user = Accounts.findUserByEmail(email);

    if (!user) throw new Meteor.Error(500, 'Sorry, there is no user with this email address');

    Accounts.sendResetPasswordEmail(user._id, email);
  }
});

