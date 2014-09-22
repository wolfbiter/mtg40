Decks = new Meteor.Collection('decks', {
  'schema': {
    'title': {
      'type': String,
      'label': 'Name',
    },
    'colors': {
      'type': [String],
      'label': 'Colors',
      'minCount': 1,
      'maxCount': 5,
    },
    'colors.$': {
      'allowedValues': ['White', 'Red', 'Blue', 'Black', 'Green', 'Colorless'],
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

Decks.allow({

  insert: function (userId, deck) {
    return true;
  },

  update: function (userId, decks, fields, modifier) {
    return true;
  },

  remove: function (userId, decks) {
    return true;
  }

});