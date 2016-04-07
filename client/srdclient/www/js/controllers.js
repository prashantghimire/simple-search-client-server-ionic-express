angular.module('srd.controllers', [])
    .controller('AppCtrl',['$scope', function ($scope) {

    }])
    .controller('HomeCtrl', ['$scope', '$http','$q', function ($scope, $http, $q) {

        var results = [
            "Apple",
            "Banana",
            "Broccoli",
            "Cabbage",
            "Cauliflower",
            "Drinks",
            "Eggs",
            "Fruits"
        ];

        $scope.list = [];

        $scope.filter = function (searchKey) {
            $scope.list = [];
            searchKey = String(searchKey).toLowerCase();
            if(!searchKey){
                //$scope.list.push("No input");
                return;
            }
            results.forEach(function (item) {
                item = String(item);
                if(item.toLowerCase().indexOf(searchKey) != -1){
                    console.log(item);
                    $scope.list.push(item);
                }
            });
        }
    }])
    .service('API', function ($http) {

    });
