
/*global angular, app*/
app.controller('coursesControllerExtension', function($scope, $controller, $rootScope, $http, $location, $mdDialog, H, M)
{
    
    $scope.removeListHeaders = function(){
		return ['is_deleted'];
    }
    
    $rootScope.hideButton = false;
    var urllearningModules = H.SETTINGS.baseUrl + '/learning_modules';
    	$http.get(urllearningModules)
        	.then(function(r){
            	$scope.learningModulesdata = r.data;
        	},function(e){
        		if(e && e.data && e.data.error && e.data.error.status){
        			newItem.error = e.data.error.message ? e.data.error.message : e.data.error.status;    
        		}
        	});
        	
        	
    var urlstatus = H.SETTINGS.baseUrl + '/status';
    	$http.get(urlstatus)
        	.then(function(r){
            	$scope.statusdata = r.data;
        	},function(e){
        		if(e && e.data && e.data.error && e.data.error.status){
        			newItem.error = e.data.error.message ? e.data.error.message : e.data.error.status;    
        		}
        	});
        	
        	
    var urldurationTypes = H.SETTINGS.baseUrl + '/duration_types';
    	$http.get(urldurationTypes)
        	.then(function(r){
            	$scope.durationTypesdata = r.data;
        	},function(e){
        		if(e && e.data && e.data.error && e.data.error.status){
        			newItem.error = e.data.error.message ? e.data.error.message : e.data.error.status;    
        		}
        	});
        	$scope.onInit = function(obj){
        //$scope.data.single is available here. 'obj' refers to the same. It is the new instance of your 'tasks' resource that matches the structure of your 'tasks' API.
             obj.is_active = 1;
           
       // $scope.loadEmployee();
       // $scope.loadUsers();
        
    };
    
    //This function is called when you are in edit mode. i.e. after a call has returned from one of your API that returns a single object. e.g http://localhost:8080/api/tasks/1
    $scope.onLoad = function(obj){
        //$scope.data.single is aavailable here. 'obj' refers to the same. It represents the object you are trying to edit.
    
    	// $scope.loadUsers();
    	
    };
    
    //This function is called when you are in list mode. i.e. before a call has been placed to one of your API that returns a the paginated list of all objects matching your API.
    $scope.beforeLoadAll = function(query){
        //This is where you can modify your query parameters.    
        //query.is_active = 1;
        //return query;
    };

    //This function is called when you are in list mode. i.e. after a call has returned from one of your API that returns a the paginated list of all objects matching your API.
    $scope.onLoadAll = function(obj){
        //$scope.data.list is available here. 'obj' refers to the same. It represents the object you are trying to edit.
        //You can call $scope.setListHeaders(['column1','column2',...]) in case the auto generated column names are not what you wish to display.
        //or You can call $scope.changeListHeaders('current column name', 'new column name') to change the display text of the headers;
    };
    
    //This function is called before the create (POST) request goes to API
    $scope.beforeSave = function(obj, next){
        //You can choose not to call next(), thus rejecting the save request. This can be used for extra validations.
      // $scope.loadEmployee(obj,function(){
       	 alert(JSON.stringify(obj));
        next();
      // });
       
    };

    //This function is called after the create (POST) request is returned from API
    $scope.onSave = function (obj, next)
    {
        //You can choose not to call next(), thus preventing the page to display the popup that confirms the object has been created.
        next();
    };
    
    //This function is called before the update (PUT) request goes to API
    $scope.beforeUpdate = function(obj, next)
    {
        //You can choose not to call next(), thus rejecting the update request. This can be used for extra validations.
        next();
    };
    //This function is called after the update (PUT) request is returned from API
    $scope.onUpdate = function (obj, next)
    {
        //You can choose not to call next(), thus preventing the page to display the popup that confirms the object has been updated.
        next();
    };
    //This function will be called whenever there is an error during save/update operations.
    $scope.onError = function (obj, next)
    {
        //You can choose not to call next(), thus preventing the page to display the popup that confirms there has been an error.
        next();
    };
        	
});