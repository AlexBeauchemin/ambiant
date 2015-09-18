Template.Home.events({});

Template.Home.rendered = function() {
    $('.collapsible').collapsible();
    $('.modal-trigger').leanModal();
};