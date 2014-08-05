/*******************/
/****** Hooks ******/
/*******************/

AutoForm.hooks({
  'matchForm': {
    'onSuccess': function (error, result, template) {
      var match = Matches.findOne(result);
      // TODO: figure out how this shifts with update and delete
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
    },
  },
});

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

Template.players.events({
  'click create': function () {
    Session.set("selected_player", this._id);
  },
});

Template.player.events({
  'click': function () {
    Session.set("selected_player", this._id);
  },
});


/*******************/
/***** Matches *****/
/*******************/

Template.matches.matches = function () {
  return _.map(Matches.find().fetch(), function(match) {
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