const createRadio = (name) => {
  return () => {
    Meteor.call('radio.create', name);
  };
};

const removeRadio = (id) => {
  return () => {
    Meteor.call('radio.remove', id);
  };
};

export { createRadio, removeRadio };
