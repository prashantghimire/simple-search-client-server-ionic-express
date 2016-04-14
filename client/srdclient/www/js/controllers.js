/**
 * @author Prashant Ghimire
 */
angular.module('srd.controllers', [])

    .controller('AppCtrl',['$scope','$state','$rootScope','API','Constant', function ($scope, $state, $rootScope, API, Constant) {
        $scope.update = function () {
            API.update()
                .then(function (response) {
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

            $scope.searchables = Utils.getSearchableFields(results);
            $scope.by = Utils.getDefaultSearchBy(results);

            $scope.filter = function (searchKey, by) {
                $scope.list = [];
                searchKey = String(searchKey).toLowerCase();
                if(!searchKey) return;

                if($rootScope.updated) {
                    results = API.getLocalData();
                    $rootScope.updated = false;
                }
                results.forEach(function (item) {
                    var searchByValue = item[by].value || "";
                    if(searchByValue.toLowerCase().indexOf(searchKey) > -1){
                        var view_data = {"value": searchByValue, "key": item.id};
                        $scope.list.push(view_data);
                    }

                });
            };
        }, function (err) {
            alert("Sorry! Error occurred while searching.");
        });
    }])
    .controller('InfoCtrl',['$scope', '$stateParams', 'API', function ($scope, $stateParams, API) {
        var data = API.getInfo($stateParams.id);

        var view_data = [];
        for (var key in data){
            var prop = {"field":key, "value":data[key].value, "data_type": data[key].data_type};
            if(prop.field == "id") continue;
            view_data.push(prop);
        }
        console.log(view_data);

        $scope.data = view_data;

    }]);
