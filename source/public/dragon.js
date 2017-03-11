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

  p1 = {x:canvas.width*0.2, y:canvas.height*0.4};
  p2 = {x:canvas.width*0.8, y:canvas.height*0.4};
  var points = [p1,p2];

  redraw(); 

  // ------ controls ------
  addEventListener('keydown', function(event) {    
    if(event.keyCode == 37) {         // left
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

    var new_points = [];
    for (var i=0; i<points.length-1; i++) {
      var p1 = points[i];
      var p2 = points[i+1];
      new_points.push( p1 );

      // need to integrate utilities.js...
    }
  }
}