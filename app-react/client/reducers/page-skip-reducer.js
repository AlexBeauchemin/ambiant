const PER_PAGE_SKIP = 10;

export default (state = 0, action = {}) => {
  switch (action.type) {
    case 'MODERATION_CHANGE_PAGE':
      // take the currentPageNumber from the payload
      return action.data.currentPageNumber * PER_PAGE_SKIP;
    default:
      return state;
  }
};