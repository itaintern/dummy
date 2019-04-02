

app.config(function($routeProvider) {
    $routeProvider

    .when("/load_milestones", {
        templateUrl : "/load_milestones.html",
        controller : "load_milestonesCtrl"
    });
});

app.controller('usersController', function($scope, $controller, $rootScope, $http, $location,$mdSidenav, $mdDialog, H, M,$route,md5) {
  
  $scope.H = H;
  $scope.M = H.M;
  
  $scope.set_user_roles = [
	  {value:"superadmin"},
	  {value:"admin"},
	  {value:"user"}
  ]
  
 $http({
 	method:'GET', 
	url:H.SETTINGS.baseUrl+'/users',
	header:'Content-Type: application/json; charset=UTF-8'
 }).then(function(response){
 	//console.log(response.data);
 	$scope.get_all_users = response.data;
 });
 
 $scope.newUser= function(){
	$mdSidenav('add_user').toggle();
 };
 
 $scope.open_set_password= function(){
	$mdSidenav('set_password').toggle();
 };
 
 $scope.close_user_sidebar= function(){
	$mdSidenav('add_user').close();
 };
 
 $scope.close_set_password= function(){
 	document.getElementById("mysetPassword").reset();
	$mdSidenav('set_password').close();
 };
 
 $scope.after_set_password= function(){
 	document.getElementById('mysetPassword').reset();
	$mdSidenav('set_password').close();
 };
 
 $scope.add_user = function(getUser){
	var get_username = getUser.username;
	var get_password = md5.createHash(getUser.password);
	var get_email = getUser.email;
	var get_role = getUser.role;
	
	console.log(get_username +'  ' + get_email+'  ' + get_password +'  ' + get_role);
	$http({
		method:'post',
		url:H.SETTINGS.baseUrl+'/users',
		header:'Content-Type: application/json; charset=UTF-8',
		data:{
			"email":getUser.email,
			"username":getUser.username,
			"password":get_password,
			"role":getUser.role,
			"secret":"206b2dbe-ecc9-490b-b81b-83767288bc5e",
		}
	}).then(function(response){
		var isvalid = response.status;
		console.log(isvalid);
          if(isvalid == 200 || isvalid==201){
            
            $route.reload();
			console.log("user ad");
          }
          else{
            alert("Something went wrong");
          }		
	});
 };
 
 var admin_md5_password1,admin_md5_password2;
 $scope.setPassword = function(id){
	var admin_email = "admin@example.com";	
	
	$http({
		method:'get',
		url:H.SETTINGS.baseUrl+'/users?email='+admin_email+'&secret=206b2dbe-ecc9-490b-b81b-83767288bc5e',
		header:'Content-Type: application/json; charset=UTF-8',
	}).then(function(response){
		admin_md5_password1 = response.data[0].password;
	});
	
	
	$scope.set_password_function = function(getPasswordData){
	admin_md5_password2 = md5.createHash(getPasswordData.adminpassword);
	
		if(admin_md5_password1 == admin_md5_password2)
		{
			if(getPasswordData.password == getPasswordData.confirmpassword){
				$http({
					method:'put',
					url:H.SETTINGS.baseUrl+'/users',
					data:{
							"id":id,
							"password":md5.createHash(getPasswordData.password),
					},
					header:'Content-Type: application/json; charset=UTF-8',
				}).then(function(response){
					$scope.after_set_password();
					$route.reload();
				});
			}
		}
	};
 };
 

});