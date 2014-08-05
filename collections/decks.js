Decks = new Meteor.Collection('decks');
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

function Deck(name, colors) {
  this['name'] = name;
  this['colors'] = colors;
  Decks.insert(this);
}