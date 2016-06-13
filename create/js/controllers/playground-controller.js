(function(){
    angular
        .module('myApp')
        .controller('PlaygroundCtrl',
        ['$scope', 'usersDb', PlaygroundCtrl]);
    function PlaygroundCtrl($scope, usersDb){
        var vm = this;
        $scope.usersDb = usersDb;
    }
})();
