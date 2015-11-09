Template.Header.rendered = function () {
  this.$('.modal-trigger').leanModal();
  this.$(".button-collapse").sideNav({closeOnClick: true});
};

Template.Header.events({
  'click [data-action="open-create-radio"]': function (e) {
    e.preventDefault();

    let $modal = $('#modal-create-radio');

    $modal.openModal();
    $modal.find('input').first().trigger('click').trigger('focus');
  },
  'click [data-action="open-register-modal"]': function (e) {
    e.preventDefault();

    let $modal = $('#modal-register');

    Session.set('register-error', null);
    $modal.openModal();
    $modal.find('input').first().trigger('click').trigger('focus');
  },
  'click [data-action="open-login-modal"]': function (e) {
    e.preventDefault();

    let $modal = $('#modal-login');

    Session.set('login-error', null);
    $modal.openModal();
    $modal.find('input').first().trigger('click').trigger('focus');
  },
  'click [data-action="logout"]': function () {
    Meteor.logout(function (error) {
      if (error) Materialize.toast(error.reason, 5000);
    });
  }
});