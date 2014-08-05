Players = new Meteor.Collection('players');
Matches = new Meteor.Collection('matches');
Decks = new Meteor.Collection('decks');

if (Meteor.isClient) {

  Template.players.players = function () {
    return Players.find();
  };

  Template.matches.matches = function () {
    return Matches.find();
  };

  Template.decks.decks = function () {
    return Decks.find();
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

  Template.match.events({
    'click': function () {
      Session.set("selected_match", this._id);
    },
  });

  Template.deck.events({
    'click': function () {
      Session.set("selected_deck", this._id);
    },
  });

}

function Player(name) {
  this['name'] = name;
  Players.insert(this);
}

function Match(p1, p2, d1, d2, w1, w2) {
  this['p1'] = p1;
  this['p2'] = p2;
  this['d1'] = d1;
  this['d2'] = d2;
  this['w1'] = w1;
  this['w2'] = w2;
  Matches.insert(this);
}

function Deck(name, colors) {
  this['name'] = name;
  this['colors'] = colors;
  Decks.insert(this);
}