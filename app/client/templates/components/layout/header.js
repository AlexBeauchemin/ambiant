Template.Header.rendered = function() {
    $('.modal-trigger').leanModal();
};

Template.Header.events({
    'click [data-action="open-signup-modal"]': function() {
        var $modal = $('#modal-signup');

        Session.set('signup-error', null);
        $modal.openModal();
        $modal.find('input').first().trigger('click').trigger('focus');
        return false;
    },
    'click [data-action="open-login-modal"]': function() {
        var $modal = $('#modal-login');

        Session.set('login-error', null);
        $modal.openModal();
        $modal.find('input').first().trigger('click').trigger('focus');
        return false;
    },
    'click [data-action="logout"]': function() {
        Meteor.logout(function(error) {
            if (error) Materialize.toast(error.reason, 5000);
            else Router.go('home');
        });
    }
});