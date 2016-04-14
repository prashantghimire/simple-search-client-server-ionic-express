angular.module('srd', ['ionic', 'srd.controllers','srd.services','ion-sticky'])

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
                cache: false,
                views: {
                    'content': {
                        templateUrl: 'views/home.html',
                        controller:'HomeCtrl'
                    }
                }
            })
        $urlRouterProvider.otherwise('/app/home');
    });
