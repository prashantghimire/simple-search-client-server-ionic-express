angular.module('srd.controllers', [])
    .controller('AppCtrl',['$scope', function ($scope) {

    }])
    .controller('HomeCtrl', ['$scope', 'API',function ($scope, API) {

        var localStorage = window.localStorage;
        var data = localStorage.getItem("srddb");
        var exists = (data !== null);
        if(!exists){
            API
                .get('http://jsonplaceholder.typicode.com/posts')
                .then(function(response){
                    var results = JSON.stringify(response.data);
                    localStorage.setItem("srddb",results);
                });
        }
        var results = JSON.parse(localStorage.getItem("srddb"));

        $scope.list = [];
        $scope.filter = function (searchKey) {
            $scope.list = [];
            searchKey = String(searchKey).toLowerCase();
            if(!searchKey){
                return;
            }
            results.forEach(function (item) {
                if(item['title'].toLowerCase().indexOf(searchKey) > -1){
                    $scope.list.push(item.title);
                }
            });
        }


    }])
    .service('API', function ($http) {
        var get = function (url) {
            return $http.get(url);
        };

        return {
            get: get
        }
    });
