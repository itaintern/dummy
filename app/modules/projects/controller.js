/* global app */
//The name of the controller should be plural that matches with your API, ending with ControllerExtension. 
//Example: your API is http://localhost:8080/api/tasks then the name of the controller is tasksControllerExtension.
//To register this controller, just go to app/config/routes.js and add 'tasks' in 'easyRoutes' array.

app.controller('projectsControllerExtension', function($scope, $controller, $rootScope, $http, $location, $mdDialog, H, M) 
{ 
	//alert('project cotroller!!');
	
	 $scope.removeListHeaders = function(){
    	return ['is_deleted']
    }
	
	 $rootScope.hideButton = false;
    var urlClient = H.SETTINGS.baseUrl + '/clients';
    	$http.get(urlClient)
        	.then(function(r){
            	$scope.Clientdata = r.data;
        	},function(e){
        		if(e && e.data && e.data.error && e.data.error.status){
        			alert(e.data.status);
        			newItem.error = e.data.error.message ? e.data.error.message : e.data.error.status;    
        		}
        	});
         $scope.newestimatedStartDate = function(Date){
       		$scope.data.single.estimated_start_date = H.toMySQLDateTime(Date);
    	};
    	$scope.newestimatedEndDate = function(Date){
       		$scope.data.single.estimated_end_date = H.toMySQLDateTime(Date);
    	};
   //$scope.UserGroups = H.R.get('user_groups');
   // $scope.Users = H.R.get('users');
   // $scope.users_employees=H.R.get('views/users_employees');
    //$scope.Get_login_user=H.R.get('views/Get_login_user');
    //employees/?id
    
     //$scope.loadEmployee=function(obj,callback)
     //{
     //		$http.get(H.S.baseUrl + '/employees/?primary_email='+$rootScope.currentUser.email+'&').then(function(r)
     //   	{
     // 		//alert('avi');
     // 			//alert(JSON.stringify($scope.data.single));
     //   		$scope.data.single.reporter_id=r.data[0].id;
      	
     // 		if(callback)
     // 		{
     // 			callback();
     // 		}
      		
        	//alert(r.data.username);
	     	//$scope.currentUser=$rootScope.currentUser.id;
		    //alert($rootScope.currentUser.id);
    //	alert(JSON.stringify(r));
    		//if(Array.isArray(r.data)){
    		//$scope.currentUser.id;
    		//get id
    	//	$scope.data.obj.reporter_id=r[0].id;
    //	alert(r);
    	//	$scope.currentUser=$rootScope.currentUser.id;
        	//	$scope.currentUser = $rootScope.currentUser;
            //else
            //{
            //$scope.currentUser = [r.data];
            //}
     //   	//alert(JSON.stringify($scope.users));
    	// });
    
     //}
     //$scope.loadEmployee($scope.data.single);
    	//$http.get(H.S.baseUrl + '/employees/?id').then(function(r)
    	  //	$http.get(H.S.baseUrl + '/employees').then(function(r)
    	//$http.get(H.S.baseUrl + '/employees').then(function(r)
    
    
    
        //$http.get(H.S.baseUrl + 'users').then(function(r){
    	//alert(r.data.username);
		//testing purpose..
		/*$scope.currentUser=$rootScope.currentUser.email	;
		alert($rootScope.currentUser.email);
    	//alert(JSON.stringify(r));
    	if(Array.isArray(r.data)){
        $scope.userEmployees = r.data;
        	}
        	else
        	{
        		$scope.userEmployees = [r.data];
        	}
        	//alert(JSON.stringify($scope.users));
    	});
    	
    	*/

//$scope.Users=H.R.get('/views/Get_login_user');
//$rootScope.test = "TEST";
//alert(	$rootScope.username);
//alert($rootScope.Users);
//$scope.login = function(){
//$scope.loading = true;
//$http.post(H.SETTINGS.baseUrl + '/users/login', {email: $scope.email, password: $scope.password})
//.then(function(r)
//{
//alert(email);
//$scope.error = "";
//alert(r.data.username);
//if(!r.data.token)
//{
//$scope.error = M.E500;
//$scope.loading = false;
//return;
//}
//$rootScope.currentUser = r.data;
//alert($rootScope.currentUser);
//alert($rootScope.username);
//		$cookies.putObject(H.getCookieKey(), JSON.stringify(r.data));
//		$location.path('/');
//	},
//alert("Hello");
//alert($scope.users_employees);
    	
//	$http.get(H.S.baseUrl + '/views/Get_login_user').then(function(r){
//		if(Array.isArray(r.data))
//		{
			
//   if (window.sessionStorage["userInfo"])
//{

//      $rootScope.userInfo = JSON.parse(window.sessionStorage["userInfo"]);
            //  }
			 //console.log($rootScope.userInfo);
			 
			   //  $rootScope.userInfo = JSON.parse(window.sessionStorage["userInfo"]);
			 
		//	 alert('user info');
		    //alert($rootScope.userInfo);
		  //  alert($rootScope.userInfo); 
		//	alert('task');
		//	var s=$rootScope.username;
		//	alert(s);
		//	alert('username using root scope');
		//	alert($rootScope.userInfo);
			//	$rootScope.currentUser
		//	alert('task over');

						//$scope.currentlogin=$rootScope.username;
					//	alert($scope.currentlogin);
			//		}
			//		else
			//		{
			//			$scope.currentlogin=[r.data];
			//		}
			//	})
				
  //  $scope.loadUserEmployees = function(){
  //  	$http.get(H.S.baseUrl + '/views/users_employees').then(function(r){
  //  	//	alert(r.data.username);
		
		// //	$scope.currentUser=$rootScope.currentUser.id;
		// //	alert($rootScope.currentUser.id);
  //  		//alert(JSON.stringify(r));
  //  				if(Array.isArray(r.data)){
  //      		$scope.userEmployees = r.data;
  //      	}
  //      	else
  //      	{
  //      		$scope.userEmployees = [r.data];
  //      	}
  //      	//alert(JSON.stringify($scope.users));
  //  	});
  //  }
    
  //   $scope.loadUsers = function(){
  //   	$scope.loadUserEmployees();
     	
  //      $scope.Users.query({}, function(r){
  //          $scope.users = r;
  //          //alert($scope.users.username);
  //          //alert(JSON.stringify($scope.users));
  //          var usersList = {};
  //          $scope.users.map(function(p){
  //              usersList[p.username] = "images/user.png";
  //          });
  //          $scope.data.usersList = usersList;
  //      });
        
  //  };
    	
  //   $scope.loadUserGroups = function(groupId, callback){
  //      $scope.UserGroups.query({group_id: groupId}, function(r){
  //          $scope.data.groupUsers = r;
  //          if(callback) callback();
  //      });
  //  };
    
  //  $scope.getUsers = function(searchText){
  //      return $http.get(H.S.baseUrl + '/users?username[in]=' + searchText)
  //          .then(function(r){
  //          	//alert('Hello');
            
  //              return r.data;
  //          });
  //      //return $scope.data.users.filter(p => p.username.includes(searchText));
  //  };
    
    //This function is called when you need to make changes to the new single object.
    $scope.onInit = function(obj){
        //$scope.data.single is available here. 'obj' refers to the same. It is the new instance of your 'tasks' resource that matches the structure of your 'tasks' API.
             obj.is_active = 1;
           
       // $scope.loadEmployee();
      //  $scope.loadUsers();
        
    };
    
    //This function is called when you are in edit mode. i.e. after a call has returned from one of your API that returns a single object. e.g http://localhost:8080/api/tasks/1
    $scope.onLoad = function(obj){
        //$scope.data.single is aavailable here. 'obj' refers to the same. It represents the object you are trying to edit.
    
    //	 $scope.loadUsers();
    	
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
    // If the singular of your title is having different spelling then you can define it as shown below.
    // $scope.getSingularTitle = function(){
    //     return "TASK";
    // }
    // If you want don't want to display certain columns in the list view you can remove them by defining the function below.
    // $scope.removeListHeaders = function(){
    //     return ['is_active'];
    // }
    // If you want to refresh the data loaded in grid, you can call the following method
    // $scope.refreshData();
});








