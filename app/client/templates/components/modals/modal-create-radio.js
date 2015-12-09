Template.modalCreateRadio.events({
  'submit [data-action="create-radio"]': function (e) {
    e.preventDefault();

    let name = e.target['radio-name'].value;

    if (!name.trim()) {
      Session.set('create-error', 'error shake');
      setTimeout(() => {
        Session.set('create-error', '');
      }, 1000);
      Materialize.toast('Name invalid', 5000);
      return;
    }

    Meteor.call('radio.create', name, function (error, res) {
      if (error) {
        Session.set('create-error', 'error shake');
        setTimeout(() => {
          Session.set('create-error', '');
        }, 1000);
        Materialize.toast(error.reason, 5000);
        return;
      }

      if (res && res.url) {
        $('#modal-create-radio').closeModal();

        // overlay seems to stay after modal is closed (only live)
        // https://github.com/Dogfalo/materialize/issues/1647
        $('.lean-overlay').remove();

        Router.go('/' + res.url);
      }
    });
  }
});
