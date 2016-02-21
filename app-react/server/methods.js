Meteor.methods({
  ['radio.create'](name) {
    return Radios.insert({name});
  },
  ['radio.remove'](_id) {
    return Radios.remove({_id});
  }
});