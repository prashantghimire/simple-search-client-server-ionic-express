angular.module('srd', ['ionic', 'srd.controllers'])

    .run(function($ionicPlatform) {
        $ionicPlatform.ready(function() {
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
    })

    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider

            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: 'views/menu.html',
                controller: 'AppCtrl'
            })

            .state('app.home', {
                url: '/home',
                controller:'HomeCtrl',
                views: {
                    'content': {
                        templateUrl: 'views/home.html'
                    }
                }
            })
        $urlRouterProvider.otherwise('/app/home');
    });
