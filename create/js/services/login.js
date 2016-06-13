(function(){
    angular
        .module("myApp") //module with wich we use service
        .factory('loginService', [
            '$http',
            '$q',
            loginService
        ]);
    //declare method of service and its name

    function loginService($http, $q){ //declare service function
        var userKey = null;

        function loadUserCheck(arg1, arg2){
            var deferred = $q.defer();
            $http.get('http://localhost:3000/user?name=' + arg1 + '&password=' + arg2)

                .success(function(data){
                    //var userKey;
                    console.log(data);
                    //debugger;
                    if (data.length <= null) {
                        userKey = null;
                        deferred.reject();
                    } else {
                        userKey = data[0].token;
                        deferred.resolve();
                    }
                });
            return deferred.promise;
        }

        function getUserKey(){
            return userKey;
        }

//return global variable to use outside the function, for global var use uppercase to first letter
        return {
            LoadUserCheck: loadUserCheck,
            GetUserKey: getUserKey
        }
    }
})();