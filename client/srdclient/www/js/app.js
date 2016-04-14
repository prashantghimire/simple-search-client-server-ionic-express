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
                cache: false,
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
            .state('app.info',{
                url:'/info/:id',
                cache: false,
                views: {
                    'content': {
                        'templateUrl': 'views/info.html',
                        'controller': 'InfoCtrl'
                    }
                },
                params:{
                    id:null
                }
            })
        $urlRouterProvider.otherwise('/app/home');
    });
