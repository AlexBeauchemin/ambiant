Template.modalLogin.events({
    "submit form": function (event) {
        var email = event.target.email.value.trim(),
            password = event.target.password.value.trim();

        Meteor.loginWithPassword(email, password, function(error) {
            if (error) {
                Session.set('login-error', 'error shake');
                Materialize.toast(error.reason, 5000);
                return;
            }

            $('#modal-login').closeModal();
        });

        return false;
    },
    'click [data-action="login-twitch"]': function (e) {
        e.preventDefault();

        var scope = ['user_read', 'user_blocks_read', 'user_subscriptions'];

        Meteor.loginWithTwitch({requestPermissions: scope}, function (err) {
            if (err) Materialize.toast("Something wrong happened, can't login with Twitch", 5000);
            else $('#modal-login').closeModal();
        });
    }
});