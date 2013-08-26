// Faculty Data Timeline from 2002 to 2012
// Inspired by mbostock's Wealth and Health of nations
// http://bost.ocks.org/mike/nations/
// Visualization No. 1

//load data
var dataset = [];
var color = d3.scale.ordinal()
.range(["steelblue", "steelblue", "steelblue", "steelblue", "steelblue", 
  "#F5DEB3", "#F5DEB3", "#F5DEB3", "#F5DEB3", "#F5DEB3", "#F5DEB3", "#F5DEB3",
  "#F08080","#F08080","#F08080","#F08080","#F08080"]);

d3.csv("data/total_faculty_timeline.csv", function (data) { //
	var yr = 2012; 
	var facultyData = data;
	yearlyData(facultyData, yr);

  function yearlyData (data, yr) {
   var year = String(yr);
   dataset = data.map(function(d) { return [+d[year]]; });
   makeDots();
 }

 function makeDots () {
  $(".dots").remove(); //remove existing dots

  dot = svg.append("g")
  .attr("class", "dots")
  .selectAll(".dot")
  .data(data)
  .enter().append("circle")
  .attr("class", "dot")
  .style("fill", function (d,i) {return color(i) } )
  .attr("r", function(d,i){ return Math.sqrt(dataset[i]); })
  .attr("cx", function(d,i) { return i * 55; })
	.attr("cy", function() { return 200; }); //Math.random() * 300;

  // add a tooltip
  dot.call(d3.helper.tooltip()
    .style({color: 'black'})
    .text(function(d, i){ return d.school + " (" + dataset[i] + ")"; })
    )
  .on('mouseover', function(d, i){ d3.select(this).style({opacity: '0.7'}); })
  .on('mouseout', function(d, i){ d3.select(this).style({opacity: '1.0'}); });
}

// Add an overlay for the year label.
var box = label.node().getBBox();

var overlay = svg.append("rect")
.attr("class", "overlay")
.attr("x", box.x)
.attr("y", box.y)
.attr("width", box.width)
.attr("height", box.height)
.on("mouseover", enableInteraction);

var keyColors = d3.scale.ordinal().range(["steelblue", "#F5DEB3", "#F08080"]);
var key = svg.selectAll(".key")
    .data(["Morningside Campus", "Graduate Schools", " Medical Schools"])
    .enter().append("g")
    .attr("class", "key")
    .attr("transform", function(d, i) { return "translate(0," + (i*20+ 270) + ")"; });

    key.append("rect")
    .attr("x", 115)
    .attr("width", 15)
    .attr("height", 15)
    .style("fill", keyColors);

    key.append("text")
    .attr("x", 100)
    .attr("y", 6)
    .attr("dy", ".55em")
    .style("text-anchor", "end")
    .text(function(d) { return d; });

// Mouseover to change the year.
function enableInteraction() {
  var yearScale = d3.scale.linear()
  .domain([2002, 2012])
  .range([box.x + 10, box.x + box.width - 10])
  .clamp(true);
  
  overlay
  .on("mouseover", mouseover)
  .on("mouseout", mouseout)
  .on("mousemove", mousemove)
  .on("touchmove", mousemove);

  function mouseover() {
    label.classed("active", true);
  }

  function mouseout() {
    label.classed("active", false);
  }

  function mousemove() {
   displayYear(Math.round(yearScale.invert(d3.mouse(this)[0])));
 }
}

// Updates the display to show the specified year.
function displayYear(year) {
  yearlyData(facultyData, year);
  label.text(Math.round(year));
}
});