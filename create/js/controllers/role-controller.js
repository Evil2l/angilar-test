(function () {
    angular
        .module('myApp')
        .controller('RoleCtrl', [
            '$scope',
            'usersDb',
            '$http',
            'tableService',
            RoleCtrl
        ]);
    function RoleCtrl($scope, usersDb, $http, tableService) {
        var vm = this;
        vm.title = 'Role';
        $scope.usersDb = usersDb;
        vm.selected = false;

        //sort things
        vm.sortType = 'name';
        vm.sortReverse = false;

        // edit things

        vm.addRow = function(){
            tableService.AddRow($scope.usersDb);
        };
        vm.sendChanges = function(){
            debugger;
            tableService.SendChanges($scope.usersDb);
        };
        vm.saveRow = function(user){
            tableService.SaveRow(user, vm.selected, user);
        };
        vm.editRow = function(user){
            tableService.EditRow(user, vm.selected);
        };


    }
})();
