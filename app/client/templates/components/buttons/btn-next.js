Template.BtnNext.events({
    'click [data-action="next"]': function() {
        Meteor.call('getNextSong', this.radio._id, function(error, res) {
            if (error) Materialize.toast(error.reason, 5000);
            else if (res && res.id) App.youtube.play(res.id);
            else Session.set('autoplay', true);
        });
    }
});