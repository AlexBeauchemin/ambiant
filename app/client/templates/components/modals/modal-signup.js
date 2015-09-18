Template.modalSignup.rendered = function() {

};

Template.modalSignup.events({
    "submit form": function (event) {
        var options = {
            email: event.target.email.value.trim(),
            password: event.target.password.value.trim(),
            profile: {
                name: event.target.name.value.trim()
            }
        };

        options = App.helpers.validateAccountCreation(options);

        if (options.errors.length) {
            return false;
        }

        Accounts.createUser(options.data, function(error) {
            if (error) {
                Session.set('signup-error', 'error shake');
                Materialize.toast(error.reason, 5000);
                return;
            }

            $('#modal-signup').closeModal();
        });

        return false;
    }
});