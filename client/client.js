/*******************/
/***** Players *****/
/*******************/

Template.players.players = function () {
  return Players.find();
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
  return Matches.find();
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
  return Decks.find();
};

Template.deck.selected = function () {
  return Session.equals("selected_deck", this._id) ? "selected" : '';
};

Template.deck.events({
  'click': function () {
    Session.set("selected_deck", this._id);
  },
});