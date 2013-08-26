//PIE CHART
//Built with help of mbostock's examples

var radius = Math.min(960, 500) / 2,
dept = ["Instruction", "Research", "Libraries", "Administration", "Support_Staff"];

var colorS = d3.scale.category20();

var pie = d3.layout.pie()
.value(function(d) { return d.Asian; })
.sort(null);

var arc = d3.svg.arc()
.innerRadius(radius - 100)
.outerRadius(radius - 20);
loadData();

function loadData () {
  d3.csv("data/Race.csv", function(raceData){
    var path = svg.datum(raceData).selectAll("path")
    .data(pie)
    .enter().append("path")
    .attr("fill", function(d, i) { return colorS(i); })
    .attr("id", function (d,i) { return dept[i]; })
    .attr("d", arc)
  .each(function(d) { this._current = d; }); // store the initial angles

  path.call(d3.helper.tooltip()
     .style({color: 'black'})
     .text(function(d, i){ return d.Field; })
     )
  .on('mouseover', function(d, i){ d3.select(this).style({opacity: '0.7'}); })
  .on('mouseout', function(d, i){ d3.select(this).style({opacity: '1.0'}); });

  d3.selectAll("input")
  .on("change", change);

  var timeout = setTimeout(function() {
    d3.select("input[value=\"Black\"]").property("checked", true).each(change);
    d3.select("input[value=\"Hispanic\"]").property("checked", true).each(change);
    d3.select("input[value=\"Native\"]").property("checked", true).each(change);
    d3.select("input[value=\"Pacific\"]").property("checked", true).each(change);
    d3.select("input[value=\"Multiple\"]").property("checked", true).each(change);
    d3.select("input[value=\"Undisclosed\"]").property("checked", true).each(change);
    d3.select("input[value=\"White\"]").property("checked", true).each(change);
    d3.select("input[value=\"Non_Resident\"]").property("checked", true).each(change);
  }, 2000);

  function change() {
    var value = this.value;
    clearTimeout(timeout);

  pie.value(function(d) { return d[value]; }); // change the value function
  path = path.data(pie); // compute the new angles
  path.transition().duration(750).attrTween("d", arcTween); // redraw the arcs
  
  path.call(d3.helper.tooltip()
     .style({color: 'black'})
     .text(function(d, i){ return dept[i]; })
     )
  .on('mouseover', function(d, i){ d3.select(this).style({opacity: '0.7'}); })
  .on('mouseout', function(d, i){ d3.select(this).style({opacity: '1.0'}); });
  }
});

}

function type(d) {
  d.Asian = +d.Asian;
  d.Black = +d.Black;
  d.Hispanic = +d.Hispanic;
  d.Native = +d.Native;
  d.Pacific = +d.Pacific;
  d.Multiple = +d.Multiple;
  d.Undisclosed = +d.Undisclosed;
  d.White = +d.White;
  d.Non_Resident = +d.Non_Resident;
  return d;
}

// Store the displayed angles in _current.
// Then, interpolate from _current to the new angles.
// During the transition, _current is updated in-place by d3.interpolate.
function arcTween(a) {
  var i = d3.interpolate(this._current, a);
  this._current = i(0);
  return function(t) {
    return arc(i(t));
  };
}
