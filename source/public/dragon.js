var dragon = angular.module('dragon', ['ngRoute']);

dragon.filter('patternInterp', function() {
  return function(pattern) {
    var output = [];
    for (item of pattern) {
      if (item == 1) {
        output.push( "down" );
      } else if (item == -1 ) {
        output.push( "up" );
      } else if (item == 0) {
        output.push( "straight" );
      }
    }
    output = output.join(', ');
    return output;
  };
});

dragon.component('dragon', {
  templateUrl : '/dragon.html',
  bindings : {},
  controller : ['$scope', '$routeParams', DragonController]
}); 

function DragonController($scope, $routeParams) {
  var canvas = document.getElementById("dragonCanvas");
  var ctx = canvas.getContext("2d");

  var background_color = "#000000";
  $scope.monocolor_color = "#ff00ff";
  $scope.gradient_color_1 = "#00ff00";
  $scope.gradient_color_2 = "#0000ff";
  $scope.use_color = "true";
  $scope.continuous_gradient = false;
  $scope.segments = 4;

  $scope.pattern = [1,-1];
  $scope.depth = 0;
  $scope.scale = 0;
  var max_depth = 15;

  var min_scale = 0.01;
  var max_scale = 10;

  var points = [];

  reset();

  // ------ controls ------
  var override = false;
  var seed = false;
  var seed_cleared = false;
  var set_pattern = false;
  var x_pan_offset = 0;
  var y_pan_offset = 0;
  var pan_rate = 5;

  addEventListener('keydown', function(event) {
    draw_background(-canvas.width, -canvas.height, canvas.width*3, canvas.height*3);
    var ekc = event.keyCode;

    if (ekc == 16) {        // shift
      override = true;
      seed = true;
    } 
    else if (ekc == 17) {   // control
      set_pattern = true;
      $scope.pattern = [];
    }
    else if (ekc == 18) {   // alt
      reset();
    }

    if (ekc == 38) {         // up
      if (set_pattern) {
        $scope.pattern.push(-1);
      } else {
        deepen();
      }
    } else if (ekc == 40) {    // down
      if (set_pattern) {
        $scope.pattern.push(1);
      } else {
        simplify();
      }
    } else if (ekc == 37 || ekc == 39) {  // left or right
      if (set_pattern) {
        $scope.pattern.push(0);
      }
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
    $scope.$apply();
  });

  addEventListener('keyup', function(event) {
    if (event.keyCode == 16) {
      override = false;
      seed = false;
      seed_cleared = false;
    }
    else if (event.keyCode == 17) {
      set_pattern = false;
    }
  });

  addEventListener('click', function(event) {
    if (seed) {
      if (!seed_cleared) {
        blank();
        seed_cleared = true;
      }

      var px = event.offsetX/canvas.offsetWidth * canvas.width;
      var py = event.offsetY/canvas.offsetHeight * canvas.height;

      points.push( {x:px, y:py, ox:px, oy:py} );
      redraw();
      $scope.$apply();
    }
  });

  // ------ functions ------
  function draw_background(x1,y1, x2,y2) {
    ctx.fillStyle = background_color;
    ctx.fillRect(x1,y1, x2,y2);
  }

  function redraw() {
    if (!points.length || points.length < 2)
      return;

    // exclude points that arent in view
    var points_in_view = [];
    for (var i=0; i<points.length; i++) {
      var point = points[i];
      if (point.x >= 0 && point.y >= 0 && point.x < canvas.width && point.y < canvas.height) {
        point.index = i;
        points_in_view.push( point );
      }
    }

    if ($scope.use_color == false) {
      ctx.strokeStyle = $scope.monocolor_color;
      ctx.beginPath();
      ctx.moveTo(points_in_view[0].x, points_in_view[0].y);

      for (var i=1; i<points_in_view.length; i++) {
        ctx.lineTo(points_in_view[i].x, points_in_view[i].y);
      }

      ctx.stroke();
    }
    else {
      var color_start = hexToRgb($scope.gradient_color_1);
      var color_end = hexToRgb($scope.gradient_color_2);
      var color_diff = [];
      for (var i=0; i<3; i++) {
        color_diff.push( color_end[i] - color_start[i] );
      }


      var segment_size = points.length/$scope.segments;
      var progress;
      var len = points_in_view.length;
      var total_len = points.length;

      for (var i=1.0; i<len; i++) {
        if (!$scope.continuous_gradient) {
          var simplified = Math.floor(points_in_view[i].index / segment_size) * segment_size;
          progress = simplified / (total_len-1);
        } else {
          progress = points_in_view[i].index / (total_len-1);
        }
        
        var r = Math.round(color_start[0]+color_diff[0]*progress);
        var g = Math.round(color_start[1]+color_diff[1]*progress);
        var b = Math.round(color_start[2]+color_diff[2]*progress);
        ctx.strokeStyle = rgbToHex( r,g,b );        

        ctx.beginPath();
        ctx.moveTo(points_in_view[i-1].x, points_in_view[i-1].y);
        ctx.lineTo(points_in_view[i].x, points_in_view[i].y);
        ctx.stroke();
      }
    }
  }  

  function deepen() {
    if (points.length <= 1 )
      return;
    if ($scope.depth >= max_depth && !override)
      return;

    $scope.depth += 1;

    var pat_len = $scope.pattern.length;

    var new_points = [ points[0] ];
    for (var i=0; i<points.length-1; i++) {
      var p1 = points[i];
      var p2 = points[i+1];

      var dist = Math.sqrt( Math.pow(p1.x-p2.x,2) + Math.pow(p1.y-p2.y,2) );
      var squared_dist = dist*dist;
      var leg_dist = Math.sqrt(squared_dist / 2);

      var odist = Math.sqrt( Math.pow(p1.ox-p2.ox,2) + Math.pow(p1.oy-p2.oy,2) );
      var osquared_dist = odist*odist;
      var oleg_dist = Math.sqrt(osquared_dist / 2);

      var angle = angle_radians(p1,p2);
      var angle_change = (Math.PI/4.0);

      if ($scope.pattern[i%pat_len] == 1) {
        var new_angle = angle + angle_change;
      } 
      else if ($scope.pattern[i%pat_len] == -1 ) {
        var new_angle = angle - angle_change;
      }
      else {
        var new_angle = angle;
      }

      var xdist = leg_dist * Math.cos(new_angle);
      var ydist = leg_dist * Math.sin(new_angle);

      var oxdist = oleg_dist * Math.cos(new_angle);
      var oydist = oleg_dist * Math.sin(new_angle);

      var middle_point = {x:p1.x+xdist, y:p1.y+ydist, ox:p1.ox+oxdist, oy:p1.oy+oydist};

      new_points.push( middle_point );
      new_points.push( p2 );
    }

    points = new_points;
  }

  function simplify() {
    if (!points.length || !(points.length % 2))
      return;

    $scope.depth -= 1;

    var new_points = [];
    for (var i=0; i<points.length; i++) {
      if (!i || !(i%2)) {
        new_points.push( points[i] );
      }
    }

    points = new_points;
  }

  function scale_multiply(multiplier) {
    var temp_scale = $scope.scale * multiplier;
    if (temp_scale <= max_scale && temp_scale >= min_scale || override) {
      $scope.scale = temp_scale;
    }
  }

  function reset() {
    blank();

    p1 = {x:canvas.width*0.2, y:canvas.height*0.5, ox:canvas.width*0.2, oy:canvas.height*0.5};
    p2 = {x:canvas.width*0.8, y:canvas.height*0.5, ox:canvas.width*0.8, oy:canvas.height*0.5};
    points = [p1,p2];

    redraw();
  }

  function blank() {
    $scope.scale = 0.77;
    x_pan_offset = 0;
    y_pan_offset = 0;
    $scope.depth = 0;

    points = [];

    draw_background(0,0, canvas.width, canvas.height);
    calculate_transform();
  }

  function calculate_transform() {
    var x_scale_offset = (canvas.width - $scope.scale*canvas.width)/2;
    var y_scale_offset = (canvas.height -$scope.scale*canvas.height)/2;
  
    for (point of points) {
      point.x = ((point.ox + x_pan_offset) * $scope.scale) + x_scale_offset + x_pan_offset;
      point.y = ((point.oy + y_pan_offset) * $scope.scale) + y_scale_offset;
    }
  }
}