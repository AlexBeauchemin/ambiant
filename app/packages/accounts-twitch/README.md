# Meteor Acccounts Twitch
### Twitch account login for meteor

This is a login package using twitch for meteor. It lets users on your website login with their twitch account by adding a single button (provided by the packlage) to your website.

## Install

`cd <your-meteor-project>`

`meteor add service-configuration`

`meteor add alexbeauchemin:accounts-twitch`

## Setup and Usage
1. Register your app with Twitch Developer Site at following url- http://www.twitch.tv/kraken/oauth2/clients/new

2. Fill out the given form but make sure that redirect url as shown as follows-

  OAuth redirect_uri:`<your-server-domain>:<port>/_oauth/twitch?close`

  For e.g.redirect url for localhost : `http://localhost:3000/_oauth/twitch?close`

3. After registration, note down the client id and client secret.
4. In your app, create the `accounts.js`, put following code inside
`<your-app-directory>/server/accounts.js` with your client id and client secret

    ```
    ServiceConfiguration.configurations.remove({
      service: "twitch"
    });
    ServiceConfiguration.configurations.insert({
      service: "twitch",
      clientId: "<your-client-id>",
      redirectUri: Meteor.absoluteUrl() + '_oauth/twitch?close',
      secret: "<your-client-secret>"
    });
    ```
5. Add the default twitch login button by adding this in your page
```
    {{>twitchLoginButton}}
```
or add this code on the click event of your custom button
```
      Meteor.loginWithTwitch(function (err) {
          if (err) console.log('login failed: ' + err)
      });
```
if you want specific permissions, add the scope as an option
```
      var scope = ['user_read', 'user_blocks_read', 'user_subscriptions'];

      Meteor.loginWithTwitch({requestPermissions: scope}, function (err) {
          if (err) console.log('login failed: ' + err)
      });
```

Now you should be able to create and account and login with Twitch