var main = angular.module('mainApp', ['ngRoute', 'dragon']);

main.config(['$locationProvider', '$routeProvider',
  function config($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');

    $routeProvider.
      when('/dragon', {
        template : '<dragon></dragon>'
      }).
      otherwise('/dragon');
  }
]);

main.controller('MainController', function MainController($scope, $location) {

});