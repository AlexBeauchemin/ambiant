Template.StaticAlerts.events({

});

Template.StaticAlerts.helpers({
  getAlerts() {
    let alerts = Session.get('static-alerts');
    return _.values(alerts);
  }
});