Template.Contact.events({
    'submit [data-action="send-email"]': function (e, template) {
        e.preventDefault();

        let name = e.target.name.value || 'No Name';
        let email = e.target.email.value;
        let title = e.target.title.value || 'message sent from website';
        let message = e.target.message.value;
        let hasErrors = false;

        if (!email) {
            hasErrors = true;
            Materialize.toast("You need to enter a valid email address", 3000);
        }

        if (!message) {
            hasErrors = true;
            Materialize.toast("You need to enter a message", 3000);
        }

        if (hasErrors) return;

        Meteor.call('sendEmail',
            name,
            email,
            title,
            message,
            function(error,result) {
                if(error) {
                    Materialize.toast(error, 5000);
                }
                else {
                    Materialize.toast("Your message has been sent. Thank you for contacting me!", 5000, 'success');
                    template.find("form").reset();
                }
            });
    }
});