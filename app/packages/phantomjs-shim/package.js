Package.describe({
  name: 'oliver:phantomjs-shim',
  version: '0.0.3',
  summary: 'Adds shims for core functions missing from PhantomJS 1.x for use in Meteor apps.',
  git: 'https://github.com/orlade/phantomjs-shim.git'
});

Package.onUse(function(api) {
  api.versionsFrom('0.9.0');
  api.addFiles('phantomjs-shim.js');
});
