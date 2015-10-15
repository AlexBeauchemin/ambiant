Template.Layout.rendered = function() {
    // Materialize binds
    $(".button-collapse").sideNav();
    //$('.collapsible').collapsible();
    $('.modal-trigger').leanModal();
    $('.dropdown-button').dropdown({
        constrain_width: false,
        hover: false,
        alignment: 'right',
        belowOrigin: true
    });
};

Template.Layout.onCreated(function() {
    WebFont.load({
        google: {
            families: ['Open+Sans:400,300,700:latin', 'Droid Serif']
        },
        active: function() {
            // Font's have loaded.. Do something!
        }
    });
});