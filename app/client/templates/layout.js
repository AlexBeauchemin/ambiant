Template.Layout.onCreated(function () {
  WebFont.load({
    google: {
      families: ['Open+Sans:400,300,700:latin', 'Courgette::latin', 'Material+Icons']
    },
    active: function () {
      // Font's have loaded.. Do something!
    }
  });
});