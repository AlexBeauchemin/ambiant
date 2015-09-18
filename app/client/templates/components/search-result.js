Template.searchResult.helpers({
  isSelected: function(song) {
    if (Session.get('search-selected-song') === song.id.videoId) return "active";
    return "";
  }
});

Template.searchResult.events({
  'click a': function(e) {
    var $target = $(e.target);

    Session.set('search-selected-song', $target.data('id'));
    Session.set('search-result', null);
    $('input[name="add-song"]').val($target.text());
  }
});