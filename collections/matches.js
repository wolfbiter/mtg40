Matches = new Meteor.Collection('matches');
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

function Match(p1, p2, d1, d2, w1, w2) {
  this['p1'] = p1;
  this['p2'] = p2;
  this['d1'] = d1;
  this['d2'] = d2;
  this['w1'] = w1;
  this['w2'] = w2;
  Matches.insert(this);
}