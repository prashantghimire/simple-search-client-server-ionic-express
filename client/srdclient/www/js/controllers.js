
angular.module('srd.controllers', ['ion-sticky'])

    .controller('AppCtrl',['$scope','$state','$rootScope','API','Constant', function ($scope, $state, $rootScope, API, Constant) {
        $scope.update = function () {
            API.update()
                .then(function (response) {
                    response.data.push({'title':'test updated data'});
                    window.localStorage.setItem(Constant.local_storage_key, JSON.stringify(response.data));
                    $rootScope.updated = true;
                    notify();
                }, function(err){
                    alert("Sorry! Error occured while updating");
                });
        };

        var notify = function () {
            alert("Data has been updated!");
        }
    }])

    .controller('HomeCtrl', ['$scope','$rootScope','API', 'Utils', function ($scope, $rootScope, API, Utils) {


        $scope.list = [];

        API.get().then(function (results) {

            $scope.searchBy = Utils.getDefaultSearchBy(results);

            $scope.filter = function (searchKey) {

                $scope.list = [];

                searchKey = String(searchKey).toLowerCase();

                if(!searchKey) return;

                if($rootScope.updated) {
                    results = API.getLocalData();
                    $rootScope.updated = false;
                }
                results.forEach(function (item) {

                    var searchByValue = item[$scope.searchBy].value;

                    if(searchByValue.toLowerCase().indexOf(searchKey) > -1){
                        var view_item = {"value": searchByValue, "key": item.id};
                        $scope.list.push(view_item);
                    }

                });
            };
        }, function (err) {
            alert("Sorry! Error occurred while searching.");
        });
    }])

    .service('API', ['$http','$q','Constant', function ($http, $q, Constant) {


        // http://jsonplaceholder.typicode.com/posts
        var localStorage = window.localStorage;

        var update = function () {
            return $http.get(Constant.api_url);
        };
        var getLocalData = function () {
            console.log("localstorage access ...");
            return JSON.parse(localStorage.getItem(Constant.local_storage_key));
        };
        var get = function () {

            var deferred = $q.defer();
            var data = localStorage.getItem(Constant.local_storage_key);

            var exists = (data !== null);

            if(!exists){
                $http
                    .get(Constant.api_url)
                    .then(function(response){
                        localStorage.setItem(Constant.local_storage_key,JSON.stringify(response.data));
                        deferred.resolve(response.data);
                    }, function (err) {
                        deferred.reject({"error": err});
                    });
            } else {
                deferred.resolve(JSON.parse(localStorage.getItem(Constant.local_storage_key)));
            }
            return deferred.promise;
        };

        return {
            get: get,
            update: update,
            getLocalData: getLocalData
        }

    }])
    .service('Utils',[function () {
        var getDefaultSearchBy = function (results) {

            for(var i = 0 ; i < results.length; i++){
                var item = results[i];
                for(var key in item){
                    var data_type = item[key].data_type || "";
                    if(data_type.indexOf("name") > -1){
                        return key;
                    }
                }
            }
        };

        return {
            getDefaultSearchBy: getDefaultSearchBy
        }

    }])
    .constant('Constant',
        {
            'local_storage_key':'srddb',
            'api_url':'js/sample.json'
        });
