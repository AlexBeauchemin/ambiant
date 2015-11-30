Template.FormAddSong.rendered = function () {
  App.search.init();
};

Template.FormAddSong.events({
  'submit [data-action="add-song"]': function (e) {
    e.preventDefault();

    if (Session.get('isAddingSong')) return;

    let song = App.search.getValue();

    if (!song) {
      Materialize.toast('You need to select a song first', 5000);
      $('#add-song').trigger('click').focus();
    }

    App.search.addSong(song, this.radio._id);
  },
  'keyup input[name="add-song"]': function (e) {
    e.preventDefault();

    App.search.keyUp(e, this.radio._id);
  }
});
