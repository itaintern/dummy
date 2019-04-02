/*global angular, app*/
app.controller('departmentsController', function(M, $scope, $controller, $rootScope, $http, $location, $mdSidenav, $mdDialog, H, $route) {
$scope.H = H;
$scope.M = H.M;
var vm = this;
	//getting data of companies  
  	var urlCompany = H.SETTINGS.baseUrl + '/organization_profile?is_deleted=0';
    	$http.get(urlCompany)
        	.then(function(response){
                $scope.company_data = response.data;
            });
    //getting data of departments
    var urlDepartment = H.SETTINGS.baseUrl + '/departments?is_deleted=0';
    	$http.get(urlDepartment)
        	.then(function(response){
                $scope.department_data = response.data;
                //console.log($scope.department_data);
            });
	//Inserting data in department table
	

	$scope.insert_department = function(){
		$http.post(H.SETTINGS.baseUrl + '/departments',$scope.model)
        	.then(function successCallback(response){
        		$scope.close_add_department();				
                                $mdDialog.show(
                                    $mdDialog.alert()
                                    .parent(angular.element(document.querySelector('#popupContainer')))
                                    .clickOutsideToClose(true)
                                    .title('Department')
                                    .textContent('Department was added Succesfully!')
                                    .ariaLabel('Department')
                                    .ok('OK')
                                  );
                                  $route.reload();
                            },function errorCallback(response){    
                            });
		
	}
	
	//Updating data in department table
	$scope.get_departmentData = function(id){
    	$scope.open_update_department();
    	$http({
          method : 'GET',
          url : H.SETTINGS.baseUrl + '/departments/'+id,
          header : 'Content-Type: application/json; charset=UTF-8'
        }).then(function(response){
        	$scope.model = response.data;
        	
        });
    
    //Saving modified data of update slider
     $scope.save_departmentData = function(model){
                    
                        $http.put(H.SETTINGS.baseUrl+'/departments/'+id,model)
                            .then(function successCallback(response){
                            	$scope.close_update_department(); 
                                $mdDialog.show(
                                    $mdDialog.alert()
                                    .parent(angular.element(document.querySelector('#popupContainer')))
                                    .clickOutsideToClose(true)
                                    .title('Department')
                                    .textContent('Department was Updated Succesfully!')
                                    .ariaLabel('Department')
                                    .ok('OK')
                                  );
                                    if(response.status == 200){  
                                	$route.reload();
                                }  
                            },function errorCallback(response){
                                $mdDialog.show(
                                    $mdDialog.alert()
                                    .parent(angular.element(document.querySelector('#popupContainer')))
                                    .clickOutsideToClose(true)
                                    .title('Department')
                                    .textContent('Department was Not Updated.')
                                    .ariaLabel('Department')
                                    .ok('OK')
                                  );
                            });
                            
                    };
    };
    
    //Deleting data from department
    $scope.delete_department = function(id){
    	
    	$http.put(H.SETTINGS.baseUrl+'/departments/', {'id': id,"is_deleted":"1"})
    	.then(function successCallback(response){
    		 $mdDialog.show(
                                    $mdDialog.alert()
                                    .parent(angular.element(document.querySelector('#popupContainer')))
                                    .clickOutsideToClose(true)
                                    .title('Department')
                                    .textContent('Department was Deleted Succesfully!')
                                    .ariaLabel('Department')
                                    .ok('OK')
                                  );
                                  $route.reload();                      
    	});
    };

    $scope.open_add_department = function(){
    	document.getElementById('form_add_department').reset();
		$mdSidenav('component_add_deparment').open();
    }
    
	$scope.close_add_department = function(){
		$mdSidenav('component_add_deparment').close();
		$scope.model ={};
		$route.reload();
	}
	$scope.open_update_department = function(){
    	document.getElementById('form_update_department').reset();
		$mdSidenav('component_update_deparment').open();
    }
    
	$scope.close_update_department = function(){
		$mdSidenav('component_update_deparment').close();
		$scope.model ={};
		$route.reload();
	}
    
    
});