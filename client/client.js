/******************/
/****** Init ******/
/******************/

Utils = {

  'unselectAll': function () {
    Session.set("selected_player", undefined);
    Session.set("selected_match", undefined);
    Session.set("selected_deck", undefined);
  },

  'resetStats': function () {
    // clear all player stats
    Players.find().fetch().forEach(function (player) {
      Players.update(player._id, { '$set': {
        'gameWins': 0,
        'gameLosses': 0,
        'matchWins': 0,
        'matchLosses': 0,
      }});
    });
    // clear all deck stats
    Decks.find().fetch().forEach(function (deck) {
      Decks.update(deck._id, { '$set': {
        'gameWins': 0,
        'gameLosses': 0,
        'matchWins': 0,
        'matchLosses': 0,
      }});
    });
  },

  'calculateStats': function () {
    // reset stats
    Utils.resetStats();
    // calculate new stats
    Matches.find().fetch().forEach(function (match) {

      var player1 = Players.findOne(match['player1']);
      var player2 = Players.findOne(match['player2']);
      var deck1 = Decks.findOne(match['deck1']);
      var deck2 = Decks.findOne(match['deck2']);
      var wins1 = match['wins1'];
      var wins2 = match['wins2'];

      // update game wins
      player1['gameWins'] += wins1;
      deck1['gameWins'] += wins1;
      player2['gameWins'] += wins2;
      deck2['gameWins'] += wins2;

      // update game losses
      player1['gameLosses'] += wins2;
      deck1['gameLosses'] += wins2;
      player2['gameLosses'] += wins1;
      deck2['gameLosses'] += wins1;

      // update matches
      if (wins1 > wins2) {
        // player1 wins
        player1['matchWins']++;
        deck1['matchWins']++;
        player2['matchLosses']++;
        deck2['matchLosses']++;
      } else if (wins2 > wins1) {
        // player2 wins
        player2['matchWins']++;
        deck2['matchWins']++;
        player1['matchLosses']++;
        deck1['matchLosses']++;
      } else {
        // incomplete/draw
      }

      // push updates
      Players.update(player1._id, {$set: player1});
      Players.update(player2._id, {$set: player2});
      Decks.update(deck1._id, {$set: deck1});
      Decks.update(deck2._id, {$set: deck2});
    });
  },
};

Session.set("formControls", {
  'type': 'none',
  'buttonContent': 'none',
});

// hack to wait for Meteor.Keybindings to load
var keyBindingsInterval = Meteor.setInterval(function(){
  if (Meteor.Keybindings) {
    Meteor.clearInterval(keyBindingsInterval);
    // add keybindings
    Meteor.Keybindings.addOne('esc', Utils.unselectAll);
  }
}, 500);


/************************/
/***** FormControls *****/
/************************/

Template.formControls.createActive = function () {
  return Session.get("formControls").type == 'insert' ? 'active' : '';
}

Template.formControls.updateActive = function () {
  return Session.get("formControls").type == 'update' ? 'active' : '';
}

Template.formControls.noneActive = function () {
  return Session.get("formControls").type == 'none' ? 'active' : '';
}

Template.formControls.events({

  'click .create': function (e) {
    Session.set("formControls", {
      'type': 'insert',
      'buttonContent': 'Add',
    });
  },
  'click .update': function (e) {
    Session.set("formControls", {
      'type': 'update',
      'buttonContent': 'Edit',
    });
  },
  'click .none': function (e) {
    Session.set("formControls", {
      'type': 'none',
      'buttonContent': 'None',
    });
    //Utils.unselectAll();
  },

})


/*******************/
/***** Players *****/
/*******************/

Template.players.players = function () {
  return Players.find({}, {
    'sort': [['matchWins', 'desc'], ['gameWins', 'desc']],
  });
};

Template.player.selected = function () {
  return Session.equals("selected_player", this._id) ? "selected" : '';
};

Template.player.events({
  'click': function (e) {
    Session.set("selected_player", this._id);
  },
});

Template.playerForm.type = function () {
  return Session.get("formControls").type;
}

Template.playerForm.buttonContent = function () {
  return Session.get("formControls").buttonContent + " Player";
}

Template.playerForm.doc = function () {
  return Players.findOne(Session.get("selected_player")) || Players.findOne();
}

Template.playerForm.formActive = function () {
  return (Session.get("formControls").type === 'none') ? false : true;
}


/*******************/
/***** Matches *****/
/*******************/

Template.matches.matches = function () {
  var deck = Session.get("selected_deck");
  var player = Session.get("selected_player");
  // get selected matches
  var criteria = {};
  if (deck && player) {
    criteria = { $and: [
      { $or: [ { 'deck1': deck, }, { 'deck2': deck, } ], },
      { $or: [ { 'player1': player, }, { 'player2': player, } ], },
    ]};
  } else if (deck) {
    criteria = { $or: [
      { 'deck1': deck, }, { 'deck2': deck, }
    ]};
  } else if (player) {
    criteria = { $or: [
      { 'player1': player, }, { 'player2': player, }
    ]};
  }
  var matches = Matches.find(criteria);
  // add player and deck information
  return _.map(matches.fetch(), function(match) {
    match['player1'] = Players.findOne(match['player1']);
    match['player2'] = Players.findOne(match['player2']);
    match['deck1'] = Decks.findOne(match['deck1']);
    match['deck2'] = Decks.findOne(match['deck2']);
    return match;
  });
};

Template.match.selected = function () {
  return Session.equals("selected_match", this._id) ? "selected" : '';
};

Template.match.events({
  'click': function () {
    Session.set("selected_match", this._id);
  },
});

Template.matchForm.type = function () {
  return Session.get("formControls").type;
}

Template.matchForm.buttonContent = function () {
  return Session.get("formControls").buttonContent + " Match";
}

Template.matchForm.doc = function () {
  return Matches.findOne(Session.get("selected_match")) || Matches.findOne();
}

Template.matchForm.formActive = function () {
  return Session.get("formControls").type === 'none' ? false : true;
}


/*******************/
/****** Decks ******/
/*******************/

Template.decks.decks = function () {
  return Decks.find({}, {
    'sort': [['matchWins', 'desc'], ['gameWins', 'desc']],
  });
};

Template.deck.selected = function () {
  return Session.equals("selected_deck", this._id) ? "selected" : '';
};

Template.deck.events({
  'click': function () {
    Session.set("selected_deck", this._id);
  },
});

Template.deckForm.type = function () {
  return Session.get("formControls").type;
}

Template.deckForm.buttonContent = function () {
  return Session.get("formControls").buttonContent + " Deck";
}

Template.deckForm.doc = function () {
  return Decks.findOne(Session.get("selected_deck")) || Decks.findOne();
}

Template.deckForm.formActive = function () {
  return Session.get("formControls").type === 'none' ? false : true;
}


/*******************/
/****** Hooks ******/
/*******************/

AutoForm.hooks({
  'matchForm': {
    'onSuccess': function (error, result, template) {
      Utils.calculateStats();
    },
  },
});
