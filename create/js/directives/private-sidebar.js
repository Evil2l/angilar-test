(function(){
    angular
        .module('myApp')
        .directive('privateSidebar', function(){
            return {
                restrict: 'E',
                templateUrl: 'js/directives/private-sidebar.html'
            };
        });
})();
