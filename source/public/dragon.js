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
  var line_color = "#ff00ff";
  ctx.strokeStyle = line_color;

  $scope.pattern = [1,-1,-1];
  var depth = 0;
  var max_depth = 15;

  var scale = 1.0;

  p1 = {x:canvas.width*0.2, y:canvas.height*0.4};
  p2 = {x:canvas.width*0.8, y:canvas.height*0.4};
  var points = [p1,p2];

  redraw(); 

  // ------ controls ------
  addEventListener('keydown', function(event) {    
    if(event.keyCode == 38) {         // up
      deepen();
    }
    else if(event.keyCode == 40) {    // down
      simplify();
    }
    else if(event.keyCode == 33) {    // page up
      scale /= 2.0;
    }
    else if(event.keyCode == 34) {    // page down
      scale *= 2.0;
    }

    ctx.setTransform(scale, 0,0, scale, 0,0 );
    redraw();
  });

  // ------ functions ------
  function draw_background() {
    ctx.fillStyle = background_color;
    ctx.fillRect(0,0, canvas.width*(1.0/scale), canvas.height*(1.0/scale));
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
    if (points.length <= 1 || depth >= max_depth)
      return;

    depth += 1;

    var disposable_pattern = $scope.pattern.slice();

    var new_points = [ points[0] ];
    for (var i=0; i<points.length-1; i++) {
      var p1 = points[i];
      var p2 = points[i+1];

      var dist = Math.sqrt( Math.pow(p1.x-p2.x,2) + Math.pow(p1.y-p2.y,2) );
      var squared_dist = dist*dist;
      var leg_dist = Math.sqrt(squared_dist / 2);

      var angle = angle_radians(p1,p2);
      var angle_change = (3.14159/4.0);

      if (disposable_pattern[0] == 1) {
        var new_angle = angle + angle_change;
      } 
      else if (disposable_pattern[0] == -1 ) {
        var new_angle = angle - angle_change;
      }
      else {
        var new_angle = angle;
      }
      disposable_pattern.unshift( disposable_pattern.pop() );

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

    depth -= 1;

    var new_points = [];
    for (var i=0; i<points.length; i++) {
      if (!i || !(i%2)) {
        new_points.push( points[i] );
      }
    }

    points = new_points;
  }

  $scope.verify_input = function() {
    var array = $scope.input_pattern.split(',');
    var valid = true;

    for (var i=0; i<array.length; i++) {
      array[i] = parseInt( array[i] );
      if (array[i] !== 1 && array[i] !== 0 && array[i] !== -1) {
        valid = false;
      }
    }

    if (valid) {
      $scope.pattern = array;
    }
  }
}