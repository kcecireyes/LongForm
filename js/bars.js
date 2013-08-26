// BAR GRAPH 

var x1 = d3.scale.ordinal();

var color3 = d3.scale.ordinal()
.range(["#008B8B", "#FFEFD5", "#FF4500", "#FF8C00"]);

var xAxis = d3.svg.axis()
.scale(x0)
.orient("bottom");

var yAxis = d3.svg.axis()
.scale(y)
.orient("left")
.tickValues([20,40,60,80,100,120])
.tickFormat(d3.format(".2s"));

d3.csv("data/tenured_nationality.csv", function(error, data) {
    var ageNames = d3.keys(data[0]).filter(function(key) { return key !== "State"; });

    data.forEach(function(d) {
      d.ages = ageNames.map(function(name) { return {name: name, value: +d[name]}; });
    });

    x0.domain(data.map(function(d) { return d.State; }));
    x1.domain(ageNames).rangeRoundBands([0, x0.rangeBand()]);
    y.domain([0, d3.max(data, function(d) { return d3.max(d.ages, function(d) { return d.value; }); })]);

    svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("No. of people");

    var state = svg.selectAll(".state")
    .data(data)
    .enter().append("g")
    .attr("class", "g")
    .attr("transform", function(d) { return "translate(" + x0(d.State) + ",0)"; })
    .call(d3.helper.tooltip() // add a tooltip
    .style({color: 'black'})
    .text(function(d, i){ return d.State; })
    )
  .on('mouseover', function(d, i){ d3.select(this).style({opacity: '0.2'}); })
  .on('mouseout', function(d, i){ d3.select(this).style({opacity: '1.0'}); });

    state.selectAll("rect")
    .data(function(d) { return d.ages; })
    .enter().append("rect")
    .attr("width", x1.rangeBand())
    .attr("x", function(d) { return x1(d.name); })
    .attr("y", function(d) { return y(d.value); })
    .attr("height", function(d) { return height - y(d.value); })
    .style("fill", function(d) { return color3(d.name); });

    var legend = svg.selectAll(".legend")
    .data(ageNames.slice().reverse())
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
    .attr("x", width - 18)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", color3);

    legend.append("text")
    .attr("x", width - 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text(function(d) { return d; });

  });		