(function () {
    angular
        .module('myApp')
        .controller('TwitchCtrl', [
            '$scope',
            'twitchTop',
            '$http',
            'tableService',
            TwitchCtrl
        ]);
    function TwitchCtrl($scope, twitchTop, $http, tableService) {
        var vm = this;
        vm.title = 'Twitch';
        $scope.twitchDb = twitchTop;
        vm.quantity = 5;
        vm.selected = false;

        //sort things
        vm.sortType = 'view';
        vm.sortReverse = false;

        // change quantity

        // edit things
        vm.saveRow = function(user){
            tableService.SaveRow(user, vm.selected, user);
        };
        vm.editRow = function(user){
            tableService.EditRow(user, vm.selected);
        };

    }
})();