    /**
     * @author Prashant Ghimire
     */
    var app = angular.module('srd.controllers', []);

    app.controller('AppCtrl', [
    '$scope',
    '$state',
    '$rootScope',
    '$ionicPlatform',
    'API',
    'Constant',
    function ($scope, $state, $rootScope, $ionicPlatform, $cordovaBarcodeScanner, API, Constant) {

                $scope.update = function () {
                    API.update()
                        .then(function (response) {
                            window.localStorage.setItem(Constant.local_storage_key, JSON.stringify(response.data));
                            $rootScope.updated = true;
                            notify();
                        }, function (err) {
                            alert("Sorry! Error occured while updating");
                        });
                };

                var notify = function () {
                    alert("Data has been updated!");
                }
    }])
        .controller('HomeCtrl', [
    '$scope',
    '$rootScope',
    'API',
    'Utils',
    'Constant',
    '$ionicPlatform',
    '$cordovaBarcodeScanner',
    function ($scope, $rootScope, API, Utils, Constant, $ionicPlatform, $cordovaBarcodeScanner) {
                
        $scope.clear = function (){
            
        };
        
        $scope.list = [];

        $scope.update = function (params) {


                    API.get(params).then(function (results) {

                        $scope.results = results;
                        $scope.searchables = Utils.getSearchableFields($scope.results);
                        $scope.by = Utils.getDefaultSearchBy($scope.results);

                        $scope.filter = function (searchKey, by) {
                            $scope.list = [];
                            searchKey = String(searchKey).toLowerCase();
                            if (!searchKey) return;

                            if ($rootScope.updated) {
                                $scope.results = API.getLocalData();
                                $rootScope.updated = false;
                            }
                            $scope.results.forEach(function (item) {
                                var searchByValue = item[by].value || "";
                                if (searchByValue.toLowerCase().indexOf(searchKey) > -1) {
                                    var view_data = {
                                        "value": searchByValue,
                                        "key": item.id
                                    };
                                    $scope.list.push(view_data);
                                }
                            });
                        };
                    }, function (err) {
                        alert("Sorry! Error occurred while searching.");
                    });
        };



        $scope.scan_code = function () {
            $ionicPlatform.ready(function () {
                console.log("done !");
            });
        }

    }])

    .controller('InfoCtrl', [
    '$scope',
    '$stateParams',
    'API',
    'Utils',
    function ($scope, $stateParams, API, Utils) {
            var data = API.getInfo($stateParams.id);
            var view_data = [];
            for (var key in data) {
                var prop = {
                    "field": key,
                    "value": data[key].value,
                    "data_type": data[key].data_type
                };
                if (prop.field == "id") continue;
                prop.data_type = Utils.validateDataType(prop.data_type);
                view_data.push(prop);
            }
            $scope.data = view_data;

    }])