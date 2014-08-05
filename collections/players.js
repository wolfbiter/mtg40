Players = new Meteor.Collection('players', {
  'schema': {
    'title': {
      'type': String,
      'label': 'Name',
    },
    'matchWins': {
      'type': Number,
      'minCount': 0,
      'defaultValue': 0,
    },
    'matchLosses': {
      'type': Number,
      'minCount': 0,
      'defaultValue': 0,
    },
    'gameWins': {
      'type': Number,
      'minCount': 0,
      'defaultValue': 0,
    },
    'gameLosses': {
      'type': Number,
      'minCount': 0,
      'defaultValue': 0,
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