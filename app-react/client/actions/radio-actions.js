const create = (name) => {
  return () => {
    Meteor.call('radio.create', name);
  };
};

const remove = (id) => {
  return () => {
    Meteor.call('radio.remove', id);
  };
};

export { create, remove };