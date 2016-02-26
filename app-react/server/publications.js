const defaultSelectors = {
  public: {$eq: true},
  live: {$eq: true},
  playlist: {$not: {$size: 0}}
};
const defaultOptions = {
  fields: {name: 1, playlist: 1, twitchChannel: 1, url: 1, nbUsers: 1, live: 1},
  sort: {dateCreated: -1},
  limit: 12
};

const getRadioPublication = function (filter, url, pageSkip = 0) {
  let query = {};
  let options = { skip: pageSkip };

  switch (filter) {
    case 'SHOW_SINGLE':
      query.url = url;
      options.limit = 1;
      break;
    case 'SHOW_OWN':
      query.users = this.userId;
      options.limit = 1;
      break;
    case 'SHOW_NEW':
      query = defaultSelectors;
      options = defaultOptions;
      break;
    case 'SHOW_TWITCH':
      query = Object.assign({}, defaultSelectors, {twitchChannel: {$ne: null}});
      options = Object.assign({}, defaultOptions, {sort: {nbUsers: -1}});
      break;
    case 'SHOW_TOP':
      query = defaultSelectors;
      options = Object.assign({}, defaultOptions, {sort: {nbUsers: -1}});
      break;
    default:
      break;
  }
  return Radios.find(query, options);
};

//Need to put this in an autorun so this.userId is accessible
Deps.autorun(() => {
  Meteor.publish('getRadios', getRadioPublication);
});