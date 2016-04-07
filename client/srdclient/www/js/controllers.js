angular.module('srd.controllers', [])
    .controller('AppCtrl',['$scope', function ($scope) {

    }])
    .controller('HomeCtrl', ['$scope', function ($scope) {
        $scope.msg = "Hello World";
    }]);
