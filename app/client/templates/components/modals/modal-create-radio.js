Template.modalCreateRadio.events({
    'submit [data-action="create-radio"]': function(e) {
        e.preventDefault();

        var name = event.target['radio-name'].value;

        if (!name.trim()) {
            Session.set('create-error', 'error shake');
            setTimeout(function() { Session.set('create-error', ''); }, 1000);
            Materialize.toast('Name invalid', 5000);
            return;
        }

        Meteor.call('createRadio', name, function(error, res) {
            if (error) {
                Session.set('create-error', 'error shake');
                setTimeout(function() { Session.set('create-error', ''); }, 1000);
                Materialize.toast(error.reason, 5000);
                return;
            }

            if (res && res.url) {
                $('#modal-create-radio').closeModal();
                Router.go('/radio/' + res.url);
            }
        });
    }
});