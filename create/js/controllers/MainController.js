(function () {
    angular
        .module("myApp")
        .controller("LoginController",
            ['$scope', 'auth', 'loginService', '$location', LoginController]);

    function LoginController($scope, auth, loginService, $location ) {
        var vm = this;
        vm.hello = "Login Please";
        vm.name = null;
        vm.pass = null;
        vm.passKey = loginService.GetUserKey;
        vm.logErr = null;

        vm.userCheck = function () {
            vm.logErr = null;
            loginService.LoadUserCheck(vm.name, vm.pass)
                .then(function () { // activate in good conditions
                    auth.isAuth = true;
                    localStorage.setItem('token', 1);

                    $location.url('/main/dashboard/twitch');
                })

                .catch(function (err) { //activate when error
                    vm.logErr = 'Wrong logs';
                    console.log(err);
                })
                .finally(function () { //activate anyway
            });
        };
    }

})();
