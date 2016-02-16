createRadio = (name) => {
  return () => {
    Meteor.call('radio.create', name);
  };
};

deleteRadio = (id) => {
  return () => {
    Meteor.call('radio.delete', id);
  };
};