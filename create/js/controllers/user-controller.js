(function(){
    angular
        .module('myApp')
        .controller('UserCtrl',[
            '$scope',
            'usersDb',
            'tableService',
            UserCtrl
        ]);
    function UserCtrl($scope, usersDb, tableService){
        var vm = this;
        vm.title = 'User';
        $scope.usersDb = usersDb;
        vm.selected = false;

        //sort things
        vm.sortType = 'name';
        vm.sortReverse = false;
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
        }
    }
})();
