/*global angular, app*/

app.controller('profilesController', function(M, $scope, $controller, $rootScope, $http, $location, $mdSidenav, $mdDialog, H, $route) {
    $scope.H = H;
    $scope.M = H.M;
    
    //to display all the profiles data
    var urlProfile = H.SETTINGS.baseUrl + '/profiles?is_deleted=0';
    	$http.get(urlProfile)
        	.then(function(response){
                $scope.profile_data = response.data;    
            });

            //converting dates
            $scope.newjoinDate = function(Date){
                $scope.data_single_joinDate = H.toMySQLDateTime(Date);
            };
                $scope.newleaveDate = function(Date){
                $scope.data_single_leaveDate = H.toMySQLDateTime(Date);
            };
                $scope.newbirthDate = function(Date){
                $scope.data_single_birthDate = H.toMySQLDateTime(Date);
            };
            
            $scope.newjoinDate_update = function(Date){
                $scope.data_single_joinDate_update = H.toMySQLDateTime(Date);
            };
                $scope.newleaveDate_update = function(Date){
                $scope.data_single_leaveDate_update = H.toMySQLDateTime(Date);
            };
                $scope.newbirthDate_update = function(Date){
                $scope.data_single_birthDate_update = H.toMySQLDateTime(Date);
            };

            //geting data of foreign keys in dropdown
                var urlCompany = H.SETTINGS.baseUrl + '/organization_profile';
                $http.get(urlCompany)
                    .then(function(r){
                        $scope.company_data = r.data;
                    },function(e){
                    if(e && e.data && e.data.error && e.data.error.status){
                        newItem.error = e.data.error.message ? e.data.error.message : e.data.error.status;    
                    }
                });
    
                var urlDepartment = H.SETTINGS.baseUrl + '/departments';
                    $http.get(urlDepartment)
                        .then(function(r){
                            $scope.Departmentdata = r.data;
                        },function(e){
                            if(e && e.data && e.data.error && e.data.error.status){
                                newItem.error = e.data.error.message ? e.data.error.message : e.data.error.status;    
                            }
                        });
                
              
                
                var urlDesignation = H.SETTINGS.baseUrl + '/designations';
                    $http.get(urlDesignation)
                        .then(function(r){
                            $scope.Designationdata = r.data;
                        },function(e){
                            if(e && e.data && e.data.error && e.data.error.status){
                                newItem.error = e.data.error.message ? e.data.error.message : e.data.error.status;    
                            }
                        });

                    //Inserting data of profiles
                    $scope.insert_profileData = function(){
                        var data={};
                        data = {
                            display_name : $scope.data_single_displayName,
                            employee_number : $scope.data_single_employeeNumber,
                            first_name : $scope.data_single_firstName,
                            last_name : $scope.data_single_lastName,
                            join_date : $scope.data_single_joinDate,
                            leave_date : $scope.data_single_leaveDate,
                            birth_date : $scope.data_single_birthDate,
                            departments_id : $scope.data_single_departments_id,
                            designations_id : $scope.data_single_designations_id,
                            roles : $scope.data_single_roles_name,
                            contact_number : $scope.data_single_contactNumber,
                            emergency_number : $scope.data_single_emergencyNumber,
                            primary_email : $scope.data_single_primaryEmail,
                            secondary_email : $scope.data_single_secondaryEmail,
                            address : $scope.data_single_address,
                            companies_id : $scope.data_single_companies_id,
                            password : $scope.data_single_password,
                            state : $scope.data_single_state,
                            country : $scope.data_single_country,
                            zipCode : $scope.data_single_zipCode,
                            city : $scope.data_single_city,
                            is_primary : $scope.data_single_isPrimary,
                            profile_picture : $scope.data_single_profilePicture,
                            status : $scope.data_single_status
                    };
                        $http.post(urlProfile,data)
                            .then(function successCallback(response){
                                $mdDialog.show(
                                    $mdDialog.alert()
                                    .parent(angular.element(document.querySelector('#popupContainer')))
                                    .clickOutsideToClose(true)
                                    .title('Profile')
                                    .textContent('Profile was added Succesfully!')
                                    .ariaLabel('Profile')
                                    .ok('OK')
                                  );
                                  $route.reload();
                            },function errorCallback(response){
                                //console.log("Profile not added")
                            });
                    }
	//Adding Primary email id, password, role into users table
	var urlUser = H.SETTINGS.baseUrl + '/users'
    $scope.addUser = function(){
    	var user={};
                        user = {
                        	username : $scope.data_single_displayName,
                            role : $scope.data_single_roles_name,
                            email : $scope.data_single_primaryEmail,
                            password : Md5.hashStr($scope.data_single_password),
                            token : Md5.hashStr(1)
                        }
                        $http.post(urlUser,user).then(function successCallback(response){
                        	console.log("user added in users table")
                        	
                        },function errorCallback(response){
                        	console.log("user not added in users table");
                        });
    }
                    
    //Getting data of profiles in update slider
    $scope.get_profileData = function(id){
    	$mdSidenav('component_update_profile').toggle();
    	
    	$http({
          method : 'GET',
          url : H.SETTINGS.baseUrl + '/profiles/'+id,
          header : 'Content-Type: application/json; charset=UTF-8'
        }).then(function(response){
							$scope.data_single_displayName_update = response.data.display_name;
                            $scope.data_single_employeeNumber_update = response.data.employee_number;
                            $scope.data_single_firstName_update = response.data.first_name;
                            $scope.data_single_lastName_update = response.data.last_name;
                            $scope.data_single_joinDate_update = response.data.join_date;
                            $scope.data_single_leaveDate_update = response.data.leave_date;
                            $scope.data_single_birthDate_update = response.data.birth_date;
                            $scope.data_single_departments_id_update = response.data.departments_id;
                            $scope.data_single_designations_id_update = response.data.designations_id;
                            $scope.data_single_roles_name_update = response.data.roles;
                            $scope.data_single_contactNumber_update = response.data.contact_number;
                            $scope.data_single_emergencyNumber_update = response.data.emergency_number;
                            $scope.data_single_primaryEmail_update = response.data.primary_email;
                            $scope.data_single_secondaryEmail_update = response.data.secondary_email;
                            $scope.data_single_address_update = response.data.address;
                            $scope.data_single_companies_id_update = response.data.companies_id;
                            $scope.data_single_password_update = response.data.password;
                            $scope.data_single_state_update = response.data.state;
                            $scope.data_single_country_update = response.data.country;
                            $scope.data_single_zipCode_update = response.data.zipCode;
                            $scope.data_single_city_update = response.data.city;
                            $scope.data_single_isPrimary_update = response.data.is_primary;
                            $scope.data_single_profilePicture_update = response.data.profile_picture;
                            $scope.data_single_status_update = response.data.status;
                    
        					});
    
    
    
    //Saving modified data of update slider
     $scope.save_profileData = function(){
     	//console.log(id);
                        var data1={};
                        data1 = {
                            display_name : $scope.data_single_displayName_update,
                            employee_number : $scope.data_single_employeeNumber_update,
                            first_name : $scope.data_single_firstName_update,
                            last_name : $scope.data_single_lastName_update,
                            join_date : $scope.data_single_joinDate_update,
                            leave_date : $scope.data_single_leaveDate_update,
                            birth_date : $scope.data_single_birthDate_update,
                            departments_id : $scope.data_single_departments_id_update,
                            designations_id : $scope.data_single_designations_id_update,
                            roles : $scope.data_single_roles_name_update,
                            contact_number : $scope.data_single_contactNumber_update,
                            emergency_number : $scope.data_single_emergencyNumber_update,
                            primary_email : $scope.data_single_primaryEmail_update,
                            secondary_email : $scope.data_single_secondaryEmail_update,
                            address : $scope.data_single_address_update,
                            companies_id : $scope.data_single_companies_id_update,
                            password : $scope.data_single_password_update,
                            state : $scope.data_single_state_update,
                            country : $scope.data_single_country_update,
                            zipCode : $scope.data_single_zipCode_update,
                            city : $scope.data_single_city_update,
                            is_primary : $scope.data_single_isPrimary_update,
                            profile_picture : $scope.data_single_profilePicture_update,
                            status : $scope.data_single_status_update
                    };
                        $http.put(H.SETTINGS.baseUrl+'/profiles/'+id,data1)
                            .then(function successCallback(response){
                                $mdDialog.show(
                                    $mdDialog.alert()
                                    .parent(angular.element(document.querySelector('#popupContainer')))
                                    .clickOutsideToClose(true)
                                    .title('Profile')
                                    .textContent('Profile was Updated Succesfully!')
                                    .ariaLabel('Profile')
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
                                    .title('Profile Updating')
                                    .textContent('Profile was Not Updated.')
                                    .ariaLabel('Profile Updating')
                                    .ok('OK')
                                  );
                            });
                            
                    };
    };
    
    
    //deliting profile
    $scope.delete_profile = function(id){
    	
    	$http.put(H.SETTINGS.baseUrl+'/profiles/', {'id': id,"is_deleted":"1"})
    	.then(function successCallback(response){
    		 $mdDialog.show(
                                    $mdDialog.alert()
                                    .parent(angular.element(document.querySelector('#popupContainer')))
                                    .clickOutsideToClose(true)
                                    .title('Profile')
                                    .textContent('Profile was Deleted Succesfully!')
                                    .ariaLabel('Profile')
                                    .ok('OK')
                                  );
    	});
    	if(response.status == 200){
    	$route.reload();
    	}
    };

                    //open close sliders
                    $scope.open_add_profile = function(){
                    	document.getElementById('form_add_profile').reset();
                        $mdSidenav('component_add_profile').open();
                        
                    }
                    
                    $scope.close_add_profile = function(){
                        $mdSidenav('component_add_profile').close();
                        document.getElementById('form_add_profile').reset();
                    }
                    
                    $scope.open_update_profile = function(){
                    	$mdSidenav('component_update_profile').open();
                    }
                    
                    $scope.close_update_profile = function(){
                    	$mdSidenav('component_update_profile').close();
                        document.getElementById('form_update_profile').reset();
                    }
});