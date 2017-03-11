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

  ctx.fillStyle = "#ff00ff";

  draw_background();

  ctx.beginPath();
  ctx.moveTo(20,20);
  ctx.lineTo(20,100);
  ctx.lineTo(70,100);
  ctx.stroke();

  function draw_background() {
    ctx.fillStyle = background_color;
    ctx.fillRect(0,0, canvas.width, canvas.height);
  }
}