Template.Radio.rendered = function () {
  $('.tooltipped').tooltip();
};

Template.Radio.events({
  'click [data-action="switch-mode"]': function () {
    let radioMode = "";
    if (!Session.get('radio-mode')) radioMode = "theatre";

    Session.set('radio-mode', radioMode);
    $('body').attr('data-mode', radioMode);
  }
});