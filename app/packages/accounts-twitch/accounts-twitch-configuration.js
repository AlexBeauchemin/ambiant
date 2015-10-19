Template.configureLoginServiceDialogForTwitch.helpers({
    siteUrl: function () {
        return Meteor.absoluteUrl();
    }
});

Template.configureLoginServiceDialogForTwitch.fields = function () {
    return [
        {property: 'clientId', label: 'Client Id'},
        {property: 'secret', label: 'Client Secret'}
    ];
};