Template.Settings.rendered = function () {
  this.$('.collapsible').collapsible();
  this.$('.tooltipped').tooltip();
};

Template.Settings.events({
  'click [name="access"]': function (e) {
    const value = e.target.value;
    if (value) Meteor.call('radio.update-config', this.radio._id, {access: value});
  },
  'click [name="skip"]': function (e) {
    const value = e.target.value;
    if (value) Meteor.call('radio.update-config', this.radio._id, {skip: value});
  },
  'click [name="limit-type"]': function (e) {
    const value = e.target.value;
    if (value) Meteor.call('radio.update-config', this.radio._id, {limitType: value});
  },
  'change #allowVote': function (e) {
    const value = !!e.currentTarget.checked;
    Meteor.call('radio.update-config', this.radio._id, {allowVote: value});
  },
  'change #public': function (e) {
    const value = !!e.currentTarget.checked;
    Meteor.call('radio.update-config', this.radio._id, {public: value});
  },
  'change #discovery': function (e) {
    const value = !!e.currentTarget.checked;
    Meteor.call('radio.update-config', this.radio._id, {discovery: value});
  },
  'change #threshold': function (e) {
    const value = parseInt(e.target.value, 10);
    Meteor.call('radio.update-config', this.radio._id, {threshold: value});
  },
  'change #limit-value': function (e) {
    const value = parseInt(e.target.value, 10);
    Meteor.call('radio.update-config', this.radio._id, {limitValue: value});
  },
  'click [data-action="delete-radio"]': function () {
    Meteor.call('radio.delete', this.radio._id);
    Router.go('home');
  },
  'click [data-action="add-moderator"]': function (e) {
    e.preventDefault();
    const $moderators = $('#moderator');
    const moderators = $moderators.val();

    if (!moderators) return;
    Meteor.call('radio.add-moderators', this.radio._id, moderators);
    $moderators.val('');
  },
  'click [data-action="remove-moderator"]': function (e, t) {
    const mod = this.valueOf();

    Meteor.call('radio.remove-moderator', t.data.radio._id, mod);
  }
});

Template.Settings.helpers({
  isChecked(param1, param2) {
    if (param1 === param2) return 'checked';
  },

  isDiscovery(value) {
    if (value === false) return;
    return 'checked'
  }
});