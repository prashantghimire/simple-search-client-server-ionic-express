/**
 * @author Prashant Ghimire
 */
angular.module('srd.services', [])
    .service('API', ['$http', '$q', 'Constant', function ($http, $q, Constant) {

        var localStorage = window.localStorage;

        var update = function () {
            return $http.get(Constant.api_url);
        };

        /**
         * Use when sure that there's local data
         * @returns {Object}
         */
        var getLocalData = function () {
            return JSON.parse(localStorage.getItem(Constant.local_storage_key));
        };

        var getInfo = function (id) {
            var data = getLocalData();
            for(var i = 0 ; i < data.length; i++){
                var item = data[i];
                if(item.id == id) {
                    return item;
                }
            }
        };

        /**
         * Use when app is initialized, will only make API call if no local data exists
         * @returns {*|promise}
         */
        var get = function () {

            var deferred = $q.defer();
            var data = localStorage.getItem(Constant.local_storage_key);

            var exists = (data !== null);

            if (!exists) {
                $http
                    .get(Constant.api_url)
                    .then(function (response) {
                        localStorage.setItem(Constant.local_storage_key, JSON.stringify(response.data));
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
            getLocalData: getLocalData,
            getInfo: getInfo
        }

    }])
    .service('Utils', ['Constant', function (Constant) {

        var validateDataType = function (data_type) {

            var available_type = Constant.data_types;
            var types = data_type.split("_") || ["text"];

            for(var i = 0; i < types.length; i++){
                for(var j = 0; j < available_type.length; j++){
                    if(types[i] == available_type[j]){
                        return types[i];
                    }
                }
            }
        };

        var getDefaultSearchBy = function (results) {
            var item = results[0];
            for (var key in item) {
                var data_type = item[key].data_type || "";
                if (data_type.indexOf("name") > -1) {
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
            getSearchableFields: getSearchableFields,
            validateDataType: validateDataType
        };

    }])
    .directive('databox', function () {

        return {
            restrict: 'E',
            template: function (elem, attr) {
                var data_type = attr.datatype;
                var data_value = attr.datavalue;
                console.log(attr);
                switch (data_type) {
                    case "image": {
                        return "<img src='" + data_value + "'/>";
                    }
                    case "url": {
                        return "<a target='_blank' href='" + data_value + "'>" + data_value + "</a>";
                    }
                    default : {
                        return "<div>"+data_value+"</div>";
                    }
                }
            },
            scope: {
                datatype: "@datatype",
                datavalue:"@datavalue"
            }
        };
    })
    .constant('Constant',
        {
            'local_storage_key': 'srddb',
            'api_url': 'js/sample.json',
            'data_types': [
                "image",
                "url",
                "video",
                "audio",
                "text",
                "email",
                "phone",
                "name"
            ]
        })

