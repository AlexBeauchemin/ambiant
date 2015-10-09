Template.searchResult.helpers({
  isSelected: function(song) {
    if (Session.get('search-selected-song') === song.id.videoId) return "active";
    return "";
  }
});

Template.searchResult.events({
  'click [data-action="select"]': function(e) {
    e.preventDefault();

    Session.set('search-selected-song', this.id.videoId);
    Session.set('search-result', null);
    $('input[name="add-song"]').val(this.snippet.title);
  },
  'click [data-action="add"]': function(e) {
    e.preventDefault();
    e.stopPropagation();

    let radioId = Template.parentData().radio._id;
    let songId = this.id.videoId;

    App.search.addSong(songId, radioId);
  }
});