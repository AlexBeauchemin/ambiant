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