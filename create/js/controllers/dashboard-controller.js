(function(){
    angular
        .module('myApp')
        .controller('DashboardCtrl',[
            '$scope',
            'userList',
            'twitchList',
            'auth',
            '$location',
            DashboardCtrl
        ]);

    function DashboardCtrl($scope, userList , twitchList, auth, $location){
        var vm = this;
        console.log(userList);
        vm.twitch = twitchList;
        console.log(twitchList);

        vm.logOut = function(){
            localStorage.clear('token');
            auth.isAuth = false;
            $location.url('/main/login');
        }
    }
})();