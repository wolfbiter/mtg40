// On server startup, create rows if the database is empty.
Meteor.startup(function () {
  if (Players.find().count() === 0) {
    // TODO
  }
});
