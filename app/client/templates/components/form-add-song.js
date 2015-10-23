Template.FormAddSong.rendered = function () {
  App.search.init();
};

Template.FormAddSong.events({
  'submit [data-action="add-song"]': function (e) {
    e.preventDefault();

    if (Session.get('isAddingSong')) return;

    let song = App.search.getValue();
    App.search.addSong(song, this.radio._id);
  },
  'keyup input[name="add-song"]': function (e) {
    e.preventDefault();

    App.search.keyUp(e, this.radio._id);
  }
});
