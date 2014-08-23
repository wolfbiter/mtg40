scalar = 20;
barPadding = 1;
w = $(window).width();
h = 500;

Meteor.startup(function () {
    
  // Create SVG element   
  var svg = d3.select("#d3")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

  Meteor.autorun(function () {

    // Join data
    var dataset = getDataset();
    var rect = svg.selectAll("rect")
      .data(dataset, function (d) { return d._id; });

    //
    // Enter new bars
    //
    var enter = rect.enter().append("rect")
      .attr("x", function(d, i) {
        return i * (w / dataset.length);
      })
      .attr("y", function(d) {
        return h - (getValue(d) * scalar);  //Height minus data value
      })
      .attr("width", 0)
      .attr("height", 0)
      .attr("fill", "rgb(255, 255, 255)")

    // animate entrance
    enter.transition(1000)
      .attr("width", w / dataset.length - barPadding)
      .attr("height", function(d) {
        return getValue(d) * scalar;  //Just the data value
      })
      .attr("fill", function(d) {
        return "rgb(0, 0, " + (getValue(d) * 10) + ")";
      })

    // animate update
    rect.transition(1000)
      .attr("x", function(d, i) {
        return i * (w / dataset.length);
      })
      .attr("y", function(d) {
        return h - (getValue(d) * scalar);  //Height minus data value
      })
      .attr("width", w / dataset.length - barPadding)
      .attr("height", function(d) {
        return getValue(d) * scalar;  //Just the data value
      })
      .attr("fill", function(d) {
        return "rgb(0, 0, " + (getValue(d) * 10) + ")";
      })

    // animate exit
    rect.exit().transition(1000)
      .attr("width", 0)
      .attr("height", 0)
      .attr("fill", "rgb(255, 255, 255)")

    // Join data
    var text = svg.selectAll("text")
      .data(dataset, function (d) { return d._id; });

    //
    // Enter new text
    //
    enter = text.enter().append("text")
      .attr("x", function(d, i) {
        return i * (w / dataset.length) + (w / dataset.length - barPadding) / 2
      })
      .attr("y", 0)
      .attr("font-family", "sans-serif")
      .attr("font-size", "15px")
      .attr("fill", "black")
      .attr("text-anchor", "middle")

    // animate entrance
    enter.transition(1000)
      .attr("y", function(d) {
        return h - (getValue(d) * scalar) - 15;
      })

    // animate update
    text.transition(1000)
      .attr("x", function(d, i) {
        return i * (w / dataset.length) + (w / dataset.length - barPadding) / 2
      })
      .attr("y", function(d) {
        return h - (getValue(d) * scalar) - 15;
      })
      .text(function(d) {
        return getTitle(d) + ": " + getValue(d);
      })
    
    // animate exit
    text.exit().transition(1000)
      .attr("y", 0)

  });
});

function getValue(d) {
  return d.matchWins || 0;
}

function getTitle(d) {
  return d.title || "";
}

function getDataset() {

  // figure out db and fields
  var field1, field2, db;
  switch (Session.get("dataset")) {
    case 'players':
      db = Players; field1 = 'player1'; field2 = 'player2'; break;
    case 'decks':
      db = Decks; field1 = 'deck1'; field2 = 'deck2'; break;
    default:
      throw new Error("INVALID DATASET", Session.get("dataset"));
  }

  // calculate data from current matches
  var matches = Utils.getMatches().fetch();
  var data = {};
  matches.forEach(function (match) {
    // make sure models are in data
    if (!(data[match[field1]])) {
      data[match[field1]] =
        $.extend({}, db.findOne(match[field1]), {
          'gameWins': 0,
          'gameLosses': 0,
          'matchWins': 0,
          'matchLosses': 0,
        });
    }
    var model1 = data[match[field1]];
    if (!(data[match[field2]])) {
      data[match[field2]] =
        $.extend({}, db.findOne(match[field2]), {
          'gameWins': 0,
          'gameLosses': 0,
          'matchWins': 0,
          'matchLosses': 0,
        });
    }
    var model2 = data[match[field2]];
    var wins1 = match['wins1'];
    var wins2 = match['wins2'];

    // update game wins
    model1['gameWins'] += wins1;
    model2['gameWins'] += wins2;

    // update game losses
    model1['gameLosses'] += wins2;
    model2['gameLosses'] += wins1;

    // update matches
    if (match.complete) {
      if (wins1 > wins2) {
        // player1 wins
        model1['matchWins']++;
        model2['matchLosses']++;
      } else if (wins2 > wins1) {
        // player2 wins
        model2['matchWins']++;
        model1['matchLosses']++;
      }
    } else {
      // incomplete / draw
    }
  });

  // curate objects into array
  var dataArray = new Array;
  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      dataArray.push(data[key]);
    }
  }
  return dataArray;
}