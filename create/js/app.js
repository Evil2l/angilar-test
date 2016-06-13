(function () {
    var app = angular.module("myApp", [
            'ui.router',
            'ui.router.stateHelper',
            'ngStorage'
        ])
        //ui-router config


        .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

            $urlRouterProvider.when("", "/main/dashboard/twitch").otherwise('/');
            $urlRouterProvider.when("/", "/main/dashboard/twitch");
            $stateProvider
                .state('main', {
                    abstract: true,
                    url: '/main',
                    templateUrl: 'templates/root.html',
                    controller: function ($scope, userDb) {
                        var vm = this;
                        vm.userDb = userDb;
                        console.log(userDb);
                    },
                    resolve: {
                        userDb: ['$http', function ($http) {
                            return $http.get('http://localhost:3000/user').then(function (response) {
                                return response.data;
                            })
                        }]
                    }
                })
                .state('main.login', {
                    url: '/login',
                    templateUrl: 'templates/login.html',
                    controller: 'LoginController',
                    controllerAs: 'vm',
                    onEnter: function ($location, auth) {
                        if (auth.isAuth) {
                            $location.url('/main/dashboard/twitch');
                        }
                    }
                })
                .state('main.dashboard', {
                    url: '/dashboard',
                    templateUrl: 'templates/dashboard.html',
                    controller: 'DashboardCtrl',
                    controllerAs: 'private',
                    resolve: {
                        userList: function (userDb) {
                            return userDb;
                        },
                        twitchList: ['$http', function ($http) {
                            return $http.get('https://api.twitch.tv/kraken/streams').then(function (response) {
                                return response.data;
                            })
                        }]
                    },
                    onEnter: function ($location, auth) {
                        if (!auth.isAuth) {
                            $location.url('/main/login');
                        }
                    }

                })
                .state('main.dashboard.twitch', {
                    url: '/twitch',
                    templateUrl: 'templates/twitch-dashboard.html',
                    controller: 'TwitchCtrl',
                    controllerAs: 'twitch',
                    resolve: {
                        twitchTop: function (twitchList) {
                            return twitchList;
                        }


                    }
                })
                .state('main.dashboard.user', {
                    url: '/user',
                    templateUrl: 'templates/user-dashboard.html',
                    controller: 'UserCtrl',
                    controllerAs: 'user',
                    resolve: {
                        usersDb: function (userDb) {
                            return userDb;
                        }
                    }
                })
                .state('main.dashboard.role', {
                    url: '/role',
                    templateUrl: 'templates/role-dashboard.html',
                    controller: 'RoleCtrl',
                    controllerAs: 'role',
                    resolve: {
                        usersDb: function (userDb) {
                            return userDb;
                        }
                    }
                })
        }])
        .run(['auth', function (auth) {
            console.log(auth);
            if (localStorage.getItem('token')) {
                auth.isAuth = true;
            }
        }])
})();