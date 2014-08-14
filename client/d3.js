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

    var dataset = Players.find().fetch();

    // Create bars
    svg.selectAll("rect")
      .data(dataset)
      .enter()
      .append("rect")
      .attr("x", function(d, i) {
        return i * (w / dataset.length);
      })
      .attr("y", function(d) {
        return h - (d.matchWins * scalar);  //Height minus data value
      })
      .attr("width", w / dataset.length - barPadding)
      .attr("height", function(d) {
        return d.matchWins * scalar;  //Just the data value
      })
      .attr("fill", function(d) {
        return "rgb(0, 0, " + (d.matchWins * 10) + ")";
      })

    // Add text
    svg.selectAll("text")
      .data(dataset)
      .enter()
      .append("text")
      .text(function(d) {
        return d.title + ": " + d.matchWins;
      })
      .attr("x", function(d, i) {
        return i * (w / dataset.length) + (w / dataset.length - barPadding) / 2
      })
      .attr("y", function(d) {
        return h - (d.matchWins * scalar) - 15;
      })
      .attr("font-family", "sans-serif")
      .attr("font-size", "15px")
      .attr("fill", "black")
      .attr("text-anchor", "middle")


  });
});