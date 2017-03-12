var dragon = angular.module('dragon', ['ngRoute']);

dragon.component('dragon', {
  templateUrl : '/dragon.html',
  bindings : {},
  controller : ['$scope', '$routeParams', DragonController]
}); 

function DragonController($scope, $routeParams) {
  var canvas = document.getElementById("dragonCanvas");
  var ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight-75;

  var background_color = "#111111";
  var line_color = "#ff00ff";
  ctx.strokeStyle = line_color;

  $scope.pattern = [1,-1];
  var depth = 0;
  var max_depth = 15;

  var scale = 1.0;
  var min_scale = 0.01;
  var max_scale = 10;

  reset();

  // ------ controls ------
  var override = false;
  var seed = false;
  var x_pan_offset = 0;
  var y_pan_offset = 0;
  var pan_rate = 5;

  addEventListener('keydown', function(event) {
    draw_background(-canvas.width, -canvas.height, canvas.width*3, canvas.height*3);
    var ekc = event.keyCode;

    if (ekc == 16) {        // shift
      override = true;
    } 
    else if (ekc == 17) {   // control
      blank();
      seed = true;
    }
    else if (ekc == 18) {   // alt
      reset();
    }

    if (ekc == 38) {         // up
      deepen();
    } else if (ekc == 40) {    // down
      simplify();
    }

      else if (ekc == 33) {    // page up
      scale_multiply(0.80);
    } else if (ekc == 34) {    // page down
      scale_multiply(1.2);
    }

      else if (ekc == 87) {    // W
      y_pan_offset += pan_rate;
    } else if (ekc == 83) {    // S
      y_pan_offset -= pan_rate;
    } else if (ekc == 65) {    // A
      x_pan_offset += pan_rate;
    } else if (ekc == 68) {    // D
      x_pan_offset -= pan_rate;
    }


    calculate_transform();
    redraw();
  });

  addEventListener('keyup', function(event) {
    if (event.keyCode == 16) {
      override = false;
    }
    else if (event.keyCode == 17) {
      seed = false;
    }
  });

  addEventListener('click', function(event) {
    if (seed) {
      points.push( {x:event.x, y:event.y} );
      redraw();
    }
  });

  // ------ functions ------
  function draw_background(x1,y1, x2,y2) {
    ctx.fillStyle = background_color;
    ctx.fillRect(x1,y1, x2,y2);
  }

  function redraw() {
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
    if (points.length <= 1 )
      return;
    if (depth >= max_depth && !override)
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

  function scale_multiply(multiplier) {
    var temp_scale = scale * multiplier;
    if (temp_scale <= max_scale && temp_scale >= min_scale || override) {
      scale = temp_scale;
    }
  }

  function reset() {
    blank();

    p1 = {x:canvas.width*0.2, y:canvas.height*0.4};
    p2 = {x:canvas.width*0.8, y:canvas.height*0.4};
    points = [p1,p2];

    redraw();
  }

  function blank() {
    scale = 1.0;
    x_pan_offset = 0;
    y_pan_offset = 0;
    $scope.pattern = [1,-1];
    depth = 0;

    points = [];

    draw_background(0,0, canvas.width, canvas.height);
    calculate_transform();
  }

  function calculate_transform() {
    var x_scale_offset = (canvas.width - scale*canvas.width)/2;
    var y_scale_offset = (canvas.height -scale*canvas.height)/2;
    ctx.setTransform(scale, 0,0, scale, x_scale_offset + x_pan_offset*scale, y_scale_offset + y_pan_offset*scale );
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