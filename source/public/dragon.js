var dragon = angular.module('dragon', ['ngRoute']);

dragon.component('dragon', {
  templateUrl : '/dragon.html',
  bindings : {},
  controller : ['$scope', '$routeParams', DragonController]
}); 

function DragonController($scope, $routeParams) {
  var canvas = document.getElementById("dragonCanvas");
  var ctx = canvas.getContext("2d");

  var background_color = "#111111";
  ctx.strokeStyle = "#ff00ff";

  var pattern = [1,-1];

  p1 = {x:canvas.width*0.2, y:canvas.height*0.4};
  p2 = {x:canvas.width*0.8, y:canvas.height*0.4};
  var points = [p1,p2];

  redraw(); 

  // ------ controls ------
  addEventListener('keydown', function(event) {    
    if(event.keyCode == 37) {         // left
      simplify();
      redraw();
    }
    else if(event.keyCode == 39) {    // right
      deepen();
      redraw();
    }
  });

  // ------ functions ------
  function draw_background() {
    ctx.fillStyle = background_color;
    ctx.fillRect(0,0, canvas.width, canvas.height);
  }

  function redraw() {
    draw_background();

    if (!points.length)
      return;

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    for (var i=1; i<points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }

    ctx.stroke();
  }

  function deepen() {
    if (points.length <= 1)
      return;

    var new_points = [ points[0] ];
    for (var i=0; i<points.length-1; i++) {
      var p1 = points[i];
      var p2 = points[i+1];

      var dist = Math.sqrt( Math.pow(p1.x-p2.x,2) + Math.pow(p1.y-p2.y,2) );
      var squared_dist = dist*dist;
      var leg_dist = Math.sqrt(squared_dist / 2);

      var angle = angle_radians(p1,p2);
      var angle_change = (3.14159/4.0);

      if (pattern[0] == 1) {
        var new_angle = angle + angle_change;
      } 
      else if (pattern[0] == -1 ) {
        var new_angle = angle - angle_change;
      }
      else {
        var new_angle = angle;
      }
      pattern.unshift( pattern.pop() );

      var xdist = leg_dist * Math.cos(new_angle);
      var ydist = leg_dist * Math.sin(new_angle);

      var middle_point = {x:p1.x+xdist, y:p1.y+ydist}; 

      new_points.push( middle_point );
      new_points.push( p2 );
    }

    points = new_points;
  }

  function simplify() {
    if (!points.length || !(points.length % 2))
      return;

    var new_points = [];
    for (var i=0; i<points.length; i++) {
      if (!i || !(i%2)) {
        new_points.push( points[i] );
      }
    }

    points = new_points;

    if (!(points.length % 2)) {
      pattern.unshift( pattern.pop() );
    }
  }
}