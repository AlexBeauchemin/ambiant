Template.Home.rendered = function () {
  this.$('ul.tabs').tabs();
};

Template.Home.events({
  'click [data-action="open-create-radio"]': function () {
    var $modal = $('#modal-create-radio');

    $modal.openModal();
    $modal.find('input').first().trigger('click').trigger('focus');
    return false;
  }
});