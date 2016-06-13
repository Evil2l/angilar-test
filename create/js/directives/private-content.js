(function(){
    angular
        .module('myApp')
        .directive('privateContent', function(){
           return {
               restrict: 'E',
               templateUrl: 'js/directives/private-content.html'
           }
        });
})();
