angular.module('srd.controllers', [])
    .controller('AppCtrl',['$scope', function ($scope) {

    }])
    .controller('HomeCtrl', ['$scope', function ($scope) {
        console.log("Hello World");
        $scope.msg = "Hello World";
    }]);
