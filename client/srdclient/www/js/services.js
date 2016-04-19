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

        var validateURL = function (url) {
            if(url.indexOf("http") > -1){
                return url;
            } else {
                return "http://"+url;
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

        var makeVideoLink = function(src){
            var type = "normal";
            if(src.indexOf(".") > -1){
                // normal video
                if(src.indexOf("//") < 0){
                    src = validateURL(src);
                }
            } else {
                // youtube video
                src = "https://www.youtube.com/embed/"+src;
                type = "youtube";
            }
            return {"src":src, "type":type};
        };
        return {
            getDefaultSearchBy: getDefaultSearchBy,
            getSearchableFields: getSearchableFields,
            validateDataType: validateDataType,
            makeVideoLink: makeVideoLink,
            validateURL: validateURL
        };

    }])
    .directive('databox', ['Utils',function(Utils) {

        var directive = {};
        directive.restrict = 'E';
        directive.scope = {
            name: "=datavalue",
            datatype: "=datatype"
        }

        directive.compile = function(element, attributes) {
            var linkFunction = function($scope, element, attributes) {
                var data_type = $scope.datatype.trim();
                var data_value = $scope.name.trim();
                var output_html = "<div class='databox'>";

                switch(data_type){
                    case "url":
                    {
                        output_html += "<span class='data-type-url' ng-click='done()'>"+data_value+"</span>";
                        element.bind('click', function () {
                            document.addEventListener('deviceready', function () {
                                cordova.InAppBrowser.open(data_value,'_blank');
                            }, false);
                        });
                        break;
                    }
                    case "image":
                    {
                        output_html += "<img src='" + Utils.validateURL(data_value) + "' />";
                        break;
                    }
                    case "phone":
                    {
                        output_html += "<a href='tel:"+data_value+"'>"+data_value+"</a>";
                        break;
                    }
                    case "video":
                    {
                        var video = Utils.makeVideoLink(data_value);
                        if(video.type == "normal"){
                            output_html +=
                                "<video controls>" +
                                "<source src='"+data_value+"' type='video/mp4'>" +
                                "<source src='"+data_value+"' type='video/ogg'>" +
                                "<source src='"+data_value+"' type='video/webm'>" +
                                "</video>";
                        } else if(video.type == "youtube"){
                            output_html += "<iframe src='"+video.src+"' frameborder='0' allowfullscreen></iframe>";
                        }

                        break;
                    }
                    case "audio":
                    {
                        output_html +=
                            "<audio controls>" +
                            "<source src='"+Utils.validateURL(data_value)+"' type='video/mp4'>" +
                            "</audio>";

                        break;
                    }
                    case "text":
                    {
                        output_html += "<p>"+data_value+"</p>";
                        break;
                    }
                    case "email":
                    {
                        output_html += "<a href='mailto:"+data_value+"'>"+data_value+"</a>";
                        break;
                    }
                    case "name":
                    {
                        output_html += "<strong class='name'>"+data_value+"</strong>";
                        break;
                    }
                    default: {
                        output_html += "<p>"+data_value+"</p>";
                    }
                }

                output_html +="</div>";
                element.html(output_html);
            };
            return linkFunction;
        };
        return directive;
    }])
    .constant('Constant',
            {
                'local_storage_key': 'srddb',
                'api_url': 'http://srdapp.com:8000/api/all',
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

