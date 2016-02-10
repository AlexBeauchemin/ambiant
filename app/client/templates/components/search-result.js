Template.searchResult.helpers({
  isSelected: function(song) {
    if (Session.get('search-selected-song') === song.id) return "active";
    return "";
  }
});

Template.searchResult.events({
  'click [data-action="select"]': function(e) {
    e.preventDefault();

    Session.set('search-selected-song', this.id);
    Session.set('search-result', null);
    $('input[name="add-song"]').val(this.title);
  },
  'click [data-action="add"]': function(e) {
    e.preventDefault();
    e.stopPropagation();

    let radioId = Template.parentData().radio._id;
    let songId = this.id;

    App.search.addSong(songId, radioId);
  }
});