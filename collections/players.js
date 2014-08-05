Players = new Meteor.Collection('players', {
  'schema': {
    'name': {
      'type': String,
      'label': 'name',
    },
  }
});

Players.allow({

  insert: function (userId, player) {
    return true;
  },

  update: function (userId, players, fields, modifier) {
    return true;
  },

  remove: function (userId, players) {
    return true;
  }

});