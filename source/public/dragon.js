var dragon = angular.module('dragon', ['ngRoute']);

dragon.component('dragon', {
  templateUrl : '/dragon.html',
  bindings : {},
  controller : ['$scope', '$routeParams', DragonController]
});

function DragonController($scope, $routeParams) {

}