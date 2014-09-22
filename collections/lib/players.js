Players = new Meteor.Collection('players', {
  'schema': {
    'title': {
      'type': String,
      'label': 'Name',
    },
    'matchWins': {
      'type': Number,
      'defaultValue': 0,
    },
    'matchLosses': {
      'type': Number,
      'defaultValue': 0,
    },
    'gameWins': {
      'type': Number,
      'defaultValue': 0,
    },
    'gameLosses': {
      'type': Number,
      'defaultValue': 0,
    },
    'elo': {
      'type': Number,
      'defaultValue': 1200,
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