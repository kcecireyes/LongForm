var state = null;

var toAdd =  '<svg class="circleSVG" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:ev="http://www.w3.org/2001/xml-events" version="1.1" baseProfile="full"><defs xmlns="http://www.w3.org/2000/svg"> <pattern id="image" patternUnits="userSpaceOnUse" width="800" height="710"><image xlink:href="images/columbia_university.jpg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0" y="0" width="800" height="710"></image></pattern></defs></svg>';

var divs = '<div id="topic1"></div><div id="topic2"></div><div id="topic3"></div>';

function resizedw(){
  var winWidth = $(window).width();
  $(".content").width(winWidth);
  $(".content").children("svg").each(function (d, obj){
    $(this).attr("width", winWidth);
  });
  $("#i1").width(winWidth*5);

  var divWidth = $("#mainDiv").width();

  if (divWidth <= 400) {
    $(".topics").remove();
    $(".abstract").hide();
    $(".circleSVG").remove();
    small();
  }
  else if (divWidth > 400 && divWidth < 900){
    $(".topics").remove();
    $(".abstract").hide();
    $(".circleSVG").remove();
    medium();
  }
  else if(state != "big"){
    $(".topics").remove();
    // $(".circleSVG").show();
    big();
  };
}
var doIt;
$(window).resize(function(){
  clearTimeout(doIt);
  // if ($(window).width() <= 900){
    //console.log("do i work?");
    doIt = setTimeout(resizedw, 100);
  //}
});


// In case the window size is less than or equal to 400 px
function small() {
  console.log("small was called")
  state = "small";
  $(".meat").append('<div class=topics></div>');
  $(".topics").append(divs);
  $("#topic1").css("background-color", "#3182bd").append('<div id="arrow" class="arrow-right1"></div>');
  $("#topic1").hover(function() {    
    $(this).append('<h2>History</h2>');    
    $(".title").hide();  
  },
  function() {
    $(this).find("h2:last").remove();
    $(".title").show();
  });            
  $("#topic2").css("background-color", "#6baed6").append('<div id="arrow" class="arrow-right2"></div>');
  $("#topic2").hover(function() {
    $(this).append('<h2><a class="smoothScroll" href="#timeline">Data</a></h2>'); 
    $("#topic2").hammer().on("swipe", function(event) {
      window.location.replace("#timeline");
    }); 
    $(".title").hide();         
  },
  function() {
    $(this).find("h2:last").remove();
    $(".title").show();
  });            
  $("#topic3").css("background-color", "#9ecae1").append('<div id="arrow" class="arrow-right3"></div>');
  $("#topic3").hover(function() {
    $(this).append('<h2>People</h2>'); 
    $(".title").hide();           
  },
  function() {
    $(this).find("h2:last").remove();
    $(".title").show();
  });            
}

// If the window size is between 401 and 899
function medium() {
  console.log("medium was called")
  state = "medium"
  $(".meat").append('<div class=topics></div>')
  $(".topics").append(divs);
  $("#topic1").hover(function() {
    $(this).append('<h2>History</h2>'); 
  },
  function() {
    $(this).find("h2:last").remove();
  });            
  $("#topic2").hover(function() {
    $(this).append('<h2><a class="smoothScroll" href="#barGraph">Data</a></h2>');          
  },
  function() {
    $(this).find("h2:last").remove();
  });            
  $("#topic3").hover(function() {
    $(this).append('<h2>People</h2>');            
  },
  function() {
    $(this).find("h2:last").remove();
  });            
}  

// If the window size is greater than 900
function big(){ 
  $(".meat").append(toAdd);
  console.log("went into big");

  state = "big"; 
  var w = 1200,
  h = 600;

  var nodes = d3.range(4).map(function() { return {radius: 90 }; }),
  color = d3.scale.category20c();  
  
  var force = d3.layout.force()
  .gravity(0.05)
  .charge(function(d, i) { return i ? 0 : -2000; })
  .nodes(nodes)
  .size([w, h]);

  force.start();

  var root = nodes[0];
  root.radius = 0;
  root.fixed = true;

  var urls = ["History", "Data", "People"];

  var svg_m = d3.select("svg");

  // console.log(svg_m)

  svg_m.selectAll("circle")
  .data(nodes.slice(1))
  .enter()
  .append("svg:circle")
  .attr("r", function(d) { return d.radius - 2; });
  force.on("tick", function(e) {
    var q = d3.geom.quadtree(nodes),
    i = 0,
    n = nodes.length;

    while (++i < n) {
      q.visit(collide(nodes[i]));
    }

    var y = [180, 360, 500];



    svg_m.selectAll("circle")
    .attr("cx", function(d,i) {  return d.x; })
    .attr("cy", function(d,i) { return y[i]; })
    .attr("id", function(d,i) { return "topic" + (i+1); });
  });

  svg_m.on("mousemove", function() {
    var p1 = d3.mouse(this);
    root.px = p1[0];
    root.py = p1[1];
    force.resume();
  });

  function collide(node) {
    var r = node.radius + 16,
    nx1 = node.x - r,
    nx2 = node.x + r,
    ny1 = node.y - r,
    ny2 = node.y + r;
    return function(quad, x1, y1, x2, y2) {
      if (quad.point && (quad.point !== node)) {
        var x = node.x - quad.point.x,
        y = node.y - quad.point.y,
        l = Math.sqrt(x * x + y * y),
        r = node.radius + quad.point.radius;
        if (l < r) {
          l = (l - r) / l * .5;
          node.x -= x *= l;
          node.y -= y *= l;
          quad.point.x += x;
          quad.point.y += y;
        }
      }
      return x1 > nx2
      || x2 < nx1
      || y1 > ny2
      || y2 < ny1;
    };
  }
}