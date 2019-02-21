app.controller('alertsControllerExtension', function($scope, $controller, $rootScope, $http, $location, $mdDialog, H, M) {
    
    $scope.removeListHeaders = function(){
    	return ['is_deleted']
    }
         $rootScope.hideButton = false;
    $scope.myDate = new Date();
    
	$scope.onLoad =  function(obj){
		$scope.loadConditions(obj.id)
    };
    
	$scope.loadConditions = function(condition){
			var urlac = H.SETTINGS.baseUrl + '/alerts_conditions?alerts_id='+condition;
    	$http.get(urlac)
        	.then(function(r){
            	$scope.alert_conditionAdd = r.data;
        	},function(e){
        		if(e && e.data && e.data.error && e.data.error.status){
        			newItem.error = e.data.error.message ? e.data.error.message : e.data.error.status;    
        		}
        	});
	}
   
   var urlam = H.SETTINGS.baseUrl + '/alerts_modules_operators?idetifiers=m';
    	$http.get(urlam)
        	.then(function(r){
            	$scope.amdata = r.data;
        	},function(e){
        		if(e && e.data && e.data.error && e.data.error.status){
        			newItem.error = e.data.error.message ? e.data.error.message : e.data.error.status;    
        		}
        	});
        	
        	
    
    var urlao = H.SETTINGS.baseUrl + '/alerts_modules_operators?idetifiers=o';
    	$http.get(urlao)
        	.then(function(r){
            	$scope.aodata = r.data;
        	},function(e){
        		if(e && e.data && e.data.error && e.data.error.status){
        			newItem.error = e.data.error.message ? e.data.error.message : e.data.error.status;    
        		}
        	});
   
	$scope.$watch('data.single.alerts_modules_operators_id', function() {
		// console.log($scope.data.single.alerts_modules_operators_id)
    	if($scope.data.single.alerts_modules_operators_id){
    		$scope.data.single.alerts_modules_operators_id==1 ? $scope.headernames(Projects="projects") : "";
    		$scope.data.single.alerts_modules_operators_id==2 ? $scope.headernames(Releases="releases") : "";
    		$scope.data.single.alerts_modules_operators_id==3 ? $scope.headernames(Holidays="company_holidays") : "";
    		$scope.data.single.alerts_modules_operators_id==4 ? $scope.headernames(Leaves="leave_requests") : "";
    		// $scope.data.single.alerts_modules_operators_id==5 ? $scope.headernames(Batches="") : "";//-------------------------------------------
    		// $scope.data.single.alerts_modules_operators_id==6 ? $scope.headernames(Userstories="user_stories") : "";//---------------------------
    		$scope.data.single.alerts_modules_operators_id==7 ? $scope.headernames(Examschedule="exam_schedules") : "";
    		$scope.data.single.alerts_modules_operators_id==8 ? $scope.headernames(Testplan="test_plans") : "";
    		// $scope.data.single.alerts_modules_operators_id==9 ? $scope.headernames(Projectplan="") : "";//---------------------------------------
    	}
	});
   
   $scope.headernames = function(modulenm){
   	
    var urlmodulenm = H.SETTINGS.baseUrl + '/' + modulenm
    	$http.get(urlmodulenm)
        	.then(function(r){
            	$scope.hnm = r.data;
        	},function(e){
        		if(e && e.data && e.data.error && e.data.error.status){
        			newItem.error = e.data.error.message ? e.data.error.message : e.data.error.status;    
        		}
        	});
   }
   
   $scope.alert_condition = H.R.get('alerts_conditions');
   if(!$scope.alert_conditionAdd) $scope.alert_conditionAdd = [];
   
	$scope.addNewCondition = function(field,operator,compare_value){
   	
   		var conditions = new $scope.alert_condition();
   		conditions.field = field;
   		conditions.operator = operator;
   		conditions.compare_value = compare_value;
   		
   		$scope.notExistsInStorage = $scope.alert_conditionAdd.filter(a => a.field == conditions.field && a.operator == conditions.operator && a.compare_value.toLowerCase() == conditions.compare_value.toLowerCase()).length == 0
   		
   		if($scope.notExistsInStorage){
   			$scope.alert_conditionAdd.push(conditions)
   		}
   		else{
   			alert("Already Exist.");
        }
		
		$scope.field = $scope.operator = $scope.compare_value = ""
	}
	
	$scope.removeCondition = function(index){
		var rmv = $scope.alert_conditionAdd.indexOf(index)
		$scope.alert_conditionAdd.splice(rmv,1)
	}
	
	
	 $scope.onSave = function(result, next){
	 	
	 	if(result){
	 		// var alert_condition = H.R.get('alerts_conditions');
	 		for (var i=0;i<$scope.alert_conditionAdd.length; i++){
	 			var ac = new $scope.alert_condition();
	 			ac.field = $scope.alert_conditionAdd[i].field;
	 			ac.operator = $scope.alert_conditionAdd[i].operator;
   				ac.compare_value = $scope.alert_conditionAdd[i].compare_value;
   				ac.alerts_id = result.id;
   				$scope.save(ac)
	 		}
	 		next();
	 	}
	 	else{
	 		next();
	 	}
	 }
	 
	 $scope.onUpdate = function(obj, next){debugger
		var done = []
		var uac  = new $scope.alert_condition();
		if(obj){
			for(var i=0; i<$scope.alert_conditionAdd.length; i++){
				if(!$scope.alert_conditionAdd[i].alerts){
					uac[i] = $scope.alert_conditionAdd[i]
					uac[i].alerts_id = obj.id
				}
			}
			done.push($scope.post('alerts_conditions',uac))
		}
	 	if(done > 0){debugger
	 		next();
	 	}
	 }
});