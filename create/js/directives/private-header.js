(function(){
    angular
        .module('myApp')
        .directive('privateHeader', function() {
            return {
                restrict: 'E',
                templateUrl: 'js/directives/private-header.html'
            };
        });
})();
