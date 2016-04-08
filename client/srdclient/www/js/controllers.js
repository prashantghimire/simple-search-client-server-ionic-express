angular.module('srd.controllers', [])
    .controller('AppCtrl',['$scope', function ($scope) {

    }])
    .controller('HomeCtrl', ['$scope', 'API',function ($scope, API) {

        $scope.searchBy = 'title';

        $scope.list = [];

        API.get().then(function (results) {
            $scope.filter = function (searchKey) {
                $scope.list = [];
                searchKey = String(searchKey).toLowerCase();
                if(!searchKey){
                    return;
                }
                results.forEach(function (item) {
                    if(item[$scope.searchBy].toLowerCase().indexOf(searchKey) > -1){
                        $scope.list.push(item[$scope.searchBy]);
                    }
                });
            }
        }, function (err) {
            alert("Sorry! Error occurred while searching.");
        });
    }])
    .service('API', function ($http, $q) {

        var get = function () {

            var localStorageKey = "srddb";
            var deferred = $q.defer();
            var localStorage = window.localStorage;
            var data = localStorage.getItem(localStorageKey);

            var exists = (data !== null);

            if(!exists){
                $http
                    .get('http://jsonplaceholder.typicode.com/posts')
                    .then(function(response){
                        localStorage.setItem(localStorageKey,JSON.stringify(response.data));
                        deferred.resolve(response.data);
                    }, function (err) {
                        deferred.reject({"error": err});
                    });
            } else {
                deferred.resolve(JSON.parse(localStorage.getItem(localStorageKey)));
            }
            return deferred.promise;
        };

        return {
            get: get
        }

    });
