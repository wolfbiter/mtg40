Matches = new Meteor.Collection('matches', {
  'schema': {
    'player1': {
      'type': String,
      'autoform': {
        'options': getPlayerOptions,
      },
      'label': 'Player 1',
    },
    'player2': {
      'type': String,
      'autoform': {
        'options': getPlayerOptions,
      },
      'label': 'Player 2',
    },
    'deck1': {
      'type': String,
      'autoform': {
        'options': getDeckOptions,
      },
      'label': 'Player 1 Deck',
      'custom': function () {
        var deck1 = this.value;
        var deck2 = this.field('deck2').value;
        return decksValidation(deck1, deck2);
      },
    },
    'deck2': {
      'type': String,
      'autoform': {
        'options': getDeckOptions,
      },
      'label': 'Player 2 Deck',
      'custom': function () {
        var deck1 = this.field('deck1').value;
        var deck2 = this.value;
        return decksValidation(deck1, deck2);
      },
    },
    'wins1': {
      'type': Number,
      'allowedValues': [0, 1, 2],
      'label': 'Player 1 Wins',
      'custom': function () {
        var wins1 = this.value;
        var wins2 = this.field('wins2').value;
        return winsValidation(wins1, wins2);
      },
    },
    'wins2': {
      'type': Number,
      'allowedValues': [0, 1, 2],
      'label': 'Player 2 Wins',
      'custom': function () {
        var wins1 = this.field('wins1').value;
        var wins2 = this.value;
        return winsValidation(wins1, wins2);
      },
    },
  }
});

function getPlayerOptions() {
  return _.map(Players.find().fetch(), function (player) {
    return {
      'label': player.title,
      'value': player._id,
    };
  });
}

function getDeckOptions() {
  return _.map(Decks.find().fetch(), function (deck) {
    return {
      'label': deck.title,
      'value': deck._id,
    };
  });
}

// custom validation, make sure deck1 != deck2
function decksValidation(deck1, deck2) {
  if (deck1 == deck2) {
    return "A deck cannot play a match against itself!";
  } else {
    return true;
  }
}

// custom validation, make sure 0 <= wins1 + wins2 < 3
function winsValidation(wins1, wins2) {
  if (wins1 + wins2 > 3) {
    return "Too many wins for a best-of-three match!";
  } else if (wins1 + wins2 <= 0) {
    return "Cannot create a match with no wins!";
  } else {
    return true;
  }
}

Matches.allow({

  insert: function (userId, match) {
    return true;
  },

  update: function (userId, matches, fields, modifier) {
    return true;
  },

  remove: function (userId, matches) {
    return true;
  }

});