/**
 * @author Prashant Ghimire
 */
angular.module('srd.services',[])
    .service('API', ['$http','$q','Constant', function ($http, $q, Constant) {

        var localStorage = window.localStorage;

        var update = function () {
            return $http.get(Constant.api_url);
        };

        /**
         * Use when sure that there's local data
         * @returns {Object}
         */
        var getLocalData = function () {
            console.log("localstorage access ...");
            return JSON.parse(localStorage.getItem(Constant.local_storage_key));
        };

        /**
         * Use when app is initialized, will only make API call if no local data exists
         * @returns {*|promise}
         */
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
        var item = results[0];
        for(var key in item){
            var data_type = item[key].data_type || "";
            if(data_type.indexOf("name") > -1){
                return key;
            }
        }
        };

        var getSearchableFields = function (results) {
            var response = [];
            var item = results[0];
            for (var key in item) {
                var searchable = item[key].data_type || "";
                if (searchable.indexOf("search") > -1) {
                    response.push(key);
                }
            }
            return response;
        };

        return {
            getDefaultSearchBy: getDefaultSearchBy,
            getSearchableFields: getSearchableFields
        };

    }])
    .constant('Constant',
        {
            'local_storage_key':'srddb',
            'api_url':'js/sample.json'
        });
