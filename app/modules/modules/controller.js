/*global angular, app*/
app.controller('modulesControllerExtension', function($scope, $controller, $rootScope, $http, $location, $mdDialog, H, M) {
    
     $scope.removeListHeaders = function(){
		return ['is_deleted'];
    }
         $rootScope.hideButton = false;

});