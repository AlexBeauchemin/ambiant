Template.StaticAlerts.events({
  'click li': (e) => {
    let $target = $(e.currentTarget);
    let key = $target.data('key');

    $target.addClass('hide');
    App.helpers.ignoreStaticAlert(key);
  },
  'click li a': function(e) {
    e.preventDefault();
  }
});

Template.StaticAlerts.helpers({
  getAlerts() {
    let alerts = Session.get('static-alerts');
    let res = [];

    _.forEach(alerts, (msg, key) => {
      res.push({ msg, key });
    });

    return res;
  }
});