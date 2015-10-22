if (Meteor.isClient) {
    Presence.state = function() {
        return {
            currentRadioId: Session.get('currentRadioId'),
            currentRadioOwner: Session.get('currentRadioOwner')
        };
    }
}

if (Meteor.isServer) {
    Meteor.publish('user-presence', function(radioId) {
        // Setup some filter to find the users your user
        // cares about. It's unlikely that you want to publish the
        // presences of _all_ the users in the system.

        // If for example we wanted to publish only logged in users we could apply:
        var filter = {userId: {$exists: true}};

        if (radioId) filter.state = { currentRadioId: radioId };

        return Presences.find(filter, { fields: { state: true, userId: true }});
    });
}


