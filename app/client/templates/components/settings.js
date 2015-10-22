Template.Settings.rendered = function() {
    this.$('.collapsible').collapsible();
    this.$('.tooltipped').tooltip();
};

Template.Settings.events({
    'click [name="access"]': function(e) {
        var value = e.target.value;
        if (value) Meteor.call('updateConfig', this.radio._id, {access: value});
    },
    'click [name="skip"]': function(e) {
        var value = e.target.value;
        if (value) Meteor.call('updateConfig', this.radio._id, {skip: value});
    },
    'click [name="limit-type"]': function(e) {
        var value = e.target.value;
        if (value) Meteor.call('updateConfig', this.radio._id, {limitType: value});
    },
    'change #public': function(e) {
        var value = !!e.currentTarget.checked;
        Meteor.call('updateConfig', this.radio._id, {public: value});
    },
    'change #threshold': function(e) {
        var value = parseInt(e.target.value,10);
        Meteor.call('updateConfig', this.radio._id, {threshold: value});
    },
    'change #limit-value': function(e) {
        var value = parseInt(e.target.value,10);
        Meteor.call('updateConfig', this.radio._id, {limitValue: value});
    },
    'click [data-action="update-twitch-info"]': function() {
        Meteor.call('isSubscribedChannel', 'summit1g', function(error,res) {
            if (error) Materialize.toast(error.reason, 5000);
            console.log(error, res);
        });
    },
    'click [data-action="delete-radio"]': function() {
        Meteor.call('deleteRadio', this.radio._id);
        Router.go('home');
    }
});

Template.Settings.helpers({
   isChecked: function(param1, param2) {
       if (param1 === param2) return "checked";
       return "";
   }
});