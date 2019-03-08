/*global angular*/
//Initialize app
var app = angular.module('app', [
							'ngRoute', 
							'ngResource', 
							'ngCookies', 
							'ui.grid', 
							'ui.grid.resizeColumns', 
							'ui.grid.moveColumns', 
							'ui.grid.selection', 
							'ui.grid.exporter', 
							'ui.grid.autoResize', 
							'ngMaterial', 
							'ngMessages',
							'angular-md5',
							'zingchart-angularjs',
							'ui.router'
							]);
/*global $*/
//JQuery
$(function() {
	$('.sidenav').sidenav({
		closeOnClick: true
	});
	
	$(document).ready(function(){
    	$('.collapsible').collapsible();
	});	
	
	$('select').formSelect();
});
/*global app, RegisterRoutes*/
app.factory('httpRequestInterceptor', function ($rootScope, $q) {
    return {
        request: function (config) {
            $rootScope.loading = true;
            if ($rootScope.currentUser) {
                config.headers['api-key'] = $rootScope.currentUser.token;
                
                if($rootScope.SETTINGS.enableSaaS){
                    if(config.method == "GET" || config.method == "DELETE" || config.method == "PUT"){
                    	var m = config.url.match(/\.[0-9a-z]+$/i);
                    	var bypassedKeywords = ['ui-grid'];
                    	var bypassedKeywordsMatches = bypassedKeywords.filter(p => config.url.indexOf(p) > -1);
                        if((m && m.length > 0) || bypassedKeywordsMatches.length > 0){
                        }else{
                        	var idx = config.url.lastIndexOf("/");
                        	var idt  = config.url.substr(idx);
	                        if(config.method == "PUT" && isNaN(idt)){
	                        	config.data.secret = $rootScope.currentUser.secret;
	                        }else{
	                            var secret = '/?secret=';
	                            if(config.url.endsWith('/')) secret = '?secret=';
	                            if(config.url.indexOf('?') > -1) secret = '&secret=';
	                            config.url = config.url + secret + $rootScope.currentUser.secret;
	                        }
                        }
                    }
                    else{
                        config.headers['secret'] = $rootScope.currentUser.secret;
                        config.data.secret = $rootScope.currentUser.secret;
                    }
                }
            }
            return config;
        },
        response: function(response){
            //if(response.headers()['content-type'] === "application/json; charset=utf-8"){
                $rootScope.loading = false;
            //}
            return response;            
        },
        responseError: function(response){
            $rootScope.loading = false;
            if(response.status === 401){
            	$rootScope.$emit('loginRequired');
            }
            if(response.status === 503){
            	$rootScope.$emit('outOfService');
            }
            return $q.reject(response);
        }
    };
});

function CustomRoutes(){
    this.routes = RegisterRoutes();
}

app.provider('customRoutes', function() {
    Object.assign(this, new CustomRoutes());

    this.$get = function() {
        return new CustomRoutes();
    };
});

app.config(function ($routeProvider, $resourceProvider, $httpProvider, customRoutesProvider) {
    var routes = customRoutesProvider.routes.customRoutes;

    var easyRoutes = customRoutesProvider.routes.easyRoutes;
    for (var i = 0; i < easyRoutes.length; i++) {
        var r = easyRoutes[i];
        routes.push({route: r, template: 'common/templates/list', controller: r});
        routes.push({route: r + '/new', template: 'common/templates/new', controller: r});
        routes.push({route: r + '/:id', template: 'common/templates/edit', controller: r});
    }

    for (var i = 0; i < routes.length; i++) {
        var r = routes[i];
        $routeProvider.when('/' + r.route, { templateUrl: 'app/modules/' + r.template + '.html', controller: r.controller + 'Controller'});
    }
    

    $httpProvider.interceptors.push('httpRequestInterceptor');
});

app.run(function ($rootScope, $location, $cookies, H) {
    $rootScope.SETTINGS = H.SETTINGS;

    $rootScope.fieldTypes = H.SETTINGS.fieldTypes;
    
    $rootScope.openRoutes = H.getOpenRoutes();

    $rootScope.$on("$locationChangeStart", function (event, next, current) {
        if (!$rootScope.currentUser) {
            
            var cookie = $cookies.get(H.getCookieKey());
            if (!cookie) {
                if($rootScope.openRoutes.indexOf($location.path()) > -1){} else {
                    $location.path('/sign-in');
                }
            }
            else {
                var cu = JSON.parse(cookie);
                $rootScope.currentUser = typeof cu==='string'? JSON.parse(cu):cu;
            }
        }
    });
    
    $rootScope.$on("loginRequired", function (event, next, current) {
    	$cookies.remove(H.getCookieKey());
		delete $rootScope.currentUser;
		$location.path('/sign-in');
    });

    $rootScope.$on("outOfService", function (event, next, current) {
    	$cookies.remove(H.getCookieKey());
		delete $rootScope.currentUser;
		$location.path('/out-of-service');
    });
    
});
//ControllerFactory helps wrap basic CRUD operations for any API resource
function ControllerFactory(resourceName, options, extras) {
	return function($scope, $rootScope, $http, $routeParams, $location, $mdDialog, H, M, S, R) {
		//Get resource by name. Usually it would be you API i.e. generated magically from your database table.
		
		var Resource = H.R.get(resourceName);

		//Scope variables
		$scope.data = {};
		$scope.data.single = new Resource();
		$scope.data.list = [];
		$scope.data.limit = 10;
		$scope.data.currentPage = 1;
		$scope.data.pages = [];
		$scope.errors = [];
		$scope.MODES = {
			'view': 'view',
			'edit': 'edit',
			'add': 'add'
		};
		$scope.mode = $scope.MODES.view;
		$scope.locked = true;
		$scope.forms = {};
		$scope.H = H;
		$scope.M = M;

		//Set currentRoute
		$scope.currentRoute = (function(){
			var route = $location.path().substring(1);
			var slash = route.indexOf('/');
			if(slash > -1){
				route = route.substring(0, slash);
			}
			return route;
		})();
		
		$scope.currentRouteHref = "#!" + $scope.currentRoute;
		$scope.newRouteHref = "#!" + $scope.currentRoute + "/new";
		$scope.editRouteHref = "#!" + $scope.currentRoute + "/:id";

		//Default error handler
		var errorHandler = function(error) {
			if (error && error.status) {
				switch (error.status) {
					case 404:
						$scope.errors.push({
							message: H.MESSAGES.E404
						});
						break;
					case 422:
						$scope.errors.push({
							message: H.MESSAGES.E422
						});
						break;
					case 405:
						$scope.errors.push({
							message: H.MESSAGES.E405
						});
						break;
					case 400:
						$scope.errors.push({
							message: H.MESSAGES.E400
						});
						break;
					case 500:
						$scope.errors.push({
							message: H.MESSAGES.E500
						});
						break;
					case 401:
						$rootScope.$emit('loginRequired');
					case 403:
						$location.path('unauthorized');
					default:
						$scope.errors.push({
							message: H.MESSAGES.E500
						});
						break;
				}
			}
		};

		//Initializa new single objetc
		$scope.initSingle = function() {
			$scope.data.single = new Resource();
		};

		//Get all rows from your API/table. Provide a query filter in case you want reduced dataset.
		$scope.query = function(q, callback) {
			if (!q) {
				q = {};
			}
			Resource.query(q, function(result) {
				if (result) {
					$scope.data.list = result;
				}
				if (callback) {
					callback(result);
				}
			}, function(error) {
			    errorHandler(error);
				if (callback) {
					callback(error);
				}
			});
		};
		
		//Get specific record
		$scope.count = function(query, callback) {
			query = query || {
				count: true
			};
			if(!query['count']) query['count'] = true;
			Resource.query(query, function(result) {
				$scope.data.records = result[0].count;
				if (callback) {
					callback(result);
				}
			}, function(error) {
			    errorHandler(error);
				if (callback) {
					callback(error);
				}
			});
		};
		

		//Get specific record
		$scope.get = function(id, callback) {
			Resource.get({
				id: id
			}, function(result) {
				$scope.data.single = result;
				if (callback) {
					callback(result);
				}
			}, function(error) {
			    errorHandler(error);
				if (callback) {
					callback(error);
				}
			});
		};

		//Delete specific record
		$scope.delete = function(obj, callback) {
			if (obj && obj.$delete) {
				if(S.legacyMode){
					$http.post(S.baseUrl + "/" + resourceName + "/delete/", obj).then(function(r){
						if (callback && r.data) {
							callback(r.data);
						}
					}, function(e){
						errorHandler(e);
						if (callback) {
							callback(e);
						}
					});
				} else {
					obj.$delete(function(r) {
						if (callback) {
							callback(r);
						}
					}, function(e) {
						errorHandler(e);
						if (callback) {
							callback(e);
						}
					});					
				}

			} else if (!isNaN(obj)) {
				$scope.get(obj, function(result) {
					if (result && result.$delete) {
						result.$delete();
						if (callback) {
							callback();
						}
					}
				});
			}
		};
		
		$scope.deleteMany = function(resource, obj, callback){
			if(obj){
				var r = resource || resourceName;
				var url = H.SETTINGS.baseUrl + "/" + r + "/";
				if(H.S.legacyMode) url = url + "delete/";
				if(Array.isArray(obj)){
					url = url + "?id=" + JSON.stringify(obj);
				} else {
					if(obj.id){
						url = url + obj.id;	
					}
				}
				if(H.S.legacyMode){
					return $http.post(url, []).then(function(r){
						if(callback){
							callback(r.data);
						}
						return r.data;
					}, function(e){
						errorHandler(e);
						if(callback){
							callback(e.data);
						}
						return e.data;
					});
				} else {
					return $http.delete(url).then(function(r){
						if(callback){
							callback(r.data);
						}
						return r.data;
					}, function(e){
						errorHandler(e);
						if(callback){
							callback(e.data);
						}
						return e.data;
					});
				}
			}

		}
		
		//Save a record
		$scope.save = function(obj, callback) {
			if (obj && obj.$save) {
				var promise = obj.$save();
				promise.then(function(r) {
					if (callback) {
						callback(r);
					}
				}, function(e){
					errorHandler(e);
					if (callback) {
						callback(e);
					}
				});
			} else if ($scope.data.single) {
				var promise = $scope.data.single.$save();
				promise.then(function(r) {
					if (callback) {
						callback(r);
					}
				}, function(e){
					errorHandler(e);
					if (callback) {
						callback(e);
					}
				});
			}
		};
		
		$scope.post = function(resource, arr, callback){
			var r = resource || resourceName;
			var url = H.SETTINGS.baseUrl + "/" + r;
			if(arr){
				if(H.SETTINGS.enableSaaS){
					arr.map(function(p){
						if(!p.secret) p.secret = $rootScope.currentUser.secret;
					});
				}
				return $http.post(url, arr)
				.then((function (data, status, headers, config) {
					if (callback) {
						callback(data.data);
					}
					return data.data;
	            }), (function (e) {
	            	errorHandler(e);
					if (callback) {
						callback(e.data);
					}
					return e.data;
				}));					
			}
		
		}
		
		$scope.update = function(obj, callback) {
			var url = H.SETTINGS.baseUrl + "/" + resourceName;
			
			if(H.S.legacyMode){
				return $http.post(url + "/update", obj)
				.then((function (data, status, headers, config) {
					if (callback) {
						callback(data.data);
					}
					return data.data;
	            }), (function (e) {
	            	errorHandler(e);
					if (callback) {
						callback(e.data);
					}
					return e.data;
				}));
			} else {
				return $http.put(url, obj)
				.then((function (data, status, headers, config) {
					if (callback) {
						callback(data.data);
					}
					return data.data;
	            }), (function (e) {
	            	errorHandler(e.data);
					if (callback) {
						callback(e.data);
					}
					return e.data;
				}));
				
			}
			
		};

		//Clear errors
		$scope.clearErrors = function() {
			$scope.errors = [];
		};

		//Refresh data
		$scope.refreshData = function() {
			$scope.listAll();
		};
		
		$scope.setActive = function(i){
			return ($rootScope.currentPage == i) ? 'active' : 'waves-effect';
		};
	
		//Load all entries on initialization
		$scope.listAll = function(currentPage){
			if(!$scope.beforeLoadAll) $scope.beforeLoadAll = function(query){
				return query;
			};
			var countQueryParam = {count:false};
			var countQuery = $scope.beforeLoadAll(countQueryParam) || countQueryParam;

			//$scope.loading = true;
			$scope.count(countQuery, function(){
				$scope.loading = true;
				$scope.data.pagesCount = parseInt(($scope.data.records - 1)/ $scope.data.limit) + 1;
				$scope.data.pages = [];
				for (var i = 0; i < $scope.data.pagesCount; i++) {
					$scope.data.pages.push(i + 1);
				}
				if(!currentPage){
					if(!($scope.data.pages.indexOf($rootScope.currentPage) > -1)){
						if($rootScope.currentPage > 0){
							$rootScope.currentPage = $scope.data.pages[$scope.data.pagesCount - 1];
						} else {
							$rootScope.currentPage = 1;
						}
					}
				} else {
					$rootScope.currentPage = currentPage;
				}
				var dataQueryParam = {limit: $scope.data.limit, offset: ($rootScope.currentPage - 1) * $scope.data.limit};
				var dataQuery = $scope.beforeLoadAll(dataQueryParam) || dataQueryParam;
				
			    $scope.query(dataQuery, function(r) {
			    	$scope.loading = false;
			    	if(r && r.length > 0){
				    	var headers = Object.getOwnPropertyNames(r[0]);
				    	$scope.data.listHeadersRaw = headers;
				    	if(headers.indexOf("id") > -1) headers.splice(headers.indexOf("id"), 1);
				    	if(headers.indexOf("secret") > -1) headers.splice(headers.indexOf("secret"), 1);
				    	headers = headers.filter(p => (p.slice(-3) !== "_id"));
				    	if($scope.removeListHeaders){
				    		var removeHeaders = $scope.removeListHeaders();
				    		for (var i = 0; i < removeHeaders.length; i++) {
				    			var h = removeHeaders[i];
				    			if(headers.indexOf(h) > -1) headers.splice(headers.indexOf(h), 1);
				    		}
				    	}
				    	$scope.data.listKeys = headers;
				    	headers = headers.map(p => H.toTitleCase(H.replaceAll(p, '_', ' ')));
				    	$scope.setListHeaders(headers);
			    	}
			    	if($scope.onLoadAll) $scope.onLoadAll(r);
			    });
				
			});
		};
		
		//Load entry on initialization
		$scope.loadSingle = function(callback){
			//$scope.loading = true;
		    $scope.get($routeParams.id, function(r) {
		    	if($scope.onLoad) $scope.onLoad(r);
		    	if(callback) callback(r);
		    	//$scope.loading = false;
		    });
		};
		
		
		//Toggle Visibility
		$scope.toggleVisibility = function(item){
		    item.visible = !item.visible;
		};
	
		//Toggle lock
	    $scope.toggleLock = function(){
	        $scope.locked = !$scope.locked;
	    };
	    
	    //Update a single record
	    $scope.updateSingle = function(callback){
			//$scope.loading = true;
	    	if($scope.beforeUpdate) {
	    		$scope.beforeUpdate($scope.data.single, function(r){
		    	var update = true;
		    	if($scope.beforeUpdateBase) update = $scope.beforeUpdateBase();
			    	if(update){
				        $scope.update($scope.data.single, function(r){
				            $scope.locked = true;
				            
				            if(r && r.error){
				            	if($scope.onError){
				            		$scope.onError(r.error, function(e){
										if($scope.onErrorBase) $scope.onErrorBase(e);
						            	return;
				            		});
				            		return;				            		
				            	} else {
					            	if($scope.onErrorBase) $scope.onErrorBase(r.error);
					            	return;
				            	}
				            }
				            
				            if($scope.onUpdate) {
				            	$scope.onUpdate(r, function(r){
				            		if($scope.onUpdateBase) $scope.onUpdateBase(r);		
				            	});
				            } else {
				            	if($scope.onUpdateBase) $scope.onUpdateBase(r);		
				            }
		                    
				            if(callback) callback(r);
							//$scope.loading = false;
				        });
			    	}
	    			
	    		});            
	    	} else {
		    	var update = true;
		    	if($scope.beforeUpdateBase) update = $scope.beforeUpdateBase();
		    	if(update){
				        $scope.update($scope.data.single, function(r){
				            $scope.locked = true;
				            
				            if(r && r.error){
				            	if($scope.onError){
				            		$scope.onError(r.error, function(e){
										if($scope.onErrorBase) $scope.onErrorBase(e);
						            	return;
				            		});
				            		return;				            		
				            	} else {
					            	if($scope.onErrorBase) $scope.onErrorBase(r.data.error);
					            	return;
				            	}
				            }
				            
				            if($scope.onUpdate) {
				            	$scope.onUpdate(r, function(r){
				            		if($scope.onUpdateBase) $scope.onUpdateBase(r);		
				            	});
				            } else {
				            	if($scope.onUpdateBase) $scope.onUpdateBase(r);		
				            }
		                    
				            if(callback) callback(r);
							//$scope.loading = false;
				        });
		    	}
	    	}
	    };	    
	    //Initialize a single record
	    $scope.newSingle = function(callback){
	    	
	    	$scope.locked = false;
	    	$scope.initSingle();
	    	if($scope.onInit) $scope.onInit($scope.data.single);
	    	if(callback) callback();
	    };
	    
	    //Save a new single record
	    $scope.saveSingle = function(callback){
	    	//$scope.loading = true;
	    	
	    	if($scope.beforeSave) {
	    		$scope.beforeSave($scope.data.single, function(r){
	    			var save = true;
	    			if($scope.beforeSaveBase) save = $scope.beforeSaveBase();
	    			if(save){
				        $scope.save($scope.data.single, function(r){
				            $scope.locked = true;
				            
				            if(r && r.error){
				            	if($scope.onError){
				            		$scope.onError(r.error, function(e){
										if($scope.onErrorBase) $scope.onErrorBase(e);
						            	return;
				            		});
				            		return;				            		
				            	} else {
					            	if($scope.onErrorBase) $scope.onErrorBase(r.data.error);
					            	return;
				            	}
				            }
				            
				            if($scope.onSave) {
				            	$scope.onSave(r, function(r){
				            		if($scope.onSaveBase) $scope.onSaveBase(r);
				            	});
				            } else {
				            	if($scope.onSaveBase) $scope.onSaveBase(r);	
				            }
				            
				            if(callback) callback(r);
				    		//$scope.loading = false;
				        });
	    			}
	    		});	
	    	} else {
		    	var save = true;
		    	if($scope.beforeSaveBase) save = $scope.beforeSaveBase();
		    	if(save){
			        $scope.save($scope.data.single, function(r){
			            $scope.locked = true;
			            
				            if(r && r.error){
				            	if($scope.onError){
				            		$scope.onError(r.error, function(e){
										if($scope.onErrorBase) $scope.onErrorBase(e);
						            	return;
				            		});
				            		return;
				            	} else {
					            	if($scope.onErrorBase) $scope.onErrorBase(r.data.error);
					            	return;
				            	}
				            }
			            
			            if($scope.onSave) {
			            	$scope.onSave(r, function(r){
			            		if($scope.onSaveBase) $scope.onSaveBase(r);
			            	});
			            } else {
			            	if($scope.onSaveBase) $scope.onSaveBase(r);	
			            }
			            
			            if(callback) callback(r);
			    		//$scope.loading = false;
			        });
		    	}    		
	    	}

	    };
	    
	    //Change a property in single
	    $scope.changeSingle = function(property, value){
	    	this.data.single[property] = value;
	    };
		

		/*Define options
			init:true -> Load all records when the controller loads
		*/
		if (options) {
			$scope.options = options;
			if ($scope.options.init) {
				$scope.query();
			}
		}

		//Any extra stuff you might want to merge into the data object
		if (extras) {
			for (var e in extras) {
				$scope.data[e] = extras[e];
			}
		}
		
		
		//Localized resources
		$scope.textResources = {
			title: {
				single: '',
				list: ''
			},
			templates: {
				edit: '',
				create: '',
				list: ''
			}
		};
		
		$scope.initTextResources = function(listTitle, singleTitle, listTemplate, listItemTemplate, listHeaderTemplate, listFooterTemplate, newTemplate, editTemplate, singleHeaderTemplate, singleFooterTemplate){
			$scope.textResources.title.list = listTitle;
			$scope.textResources.title.single = singleTitle;
			$scope.textResources.templates.list = listTemplate;
			$scope.textResources.templates.listItem = listItemTemplate;
			$scope.textResources.templates.listHeader = listHeaderTemplate;
			$scope.textResources.templates.listFooter = listFooterTemplate;
			$scope.textResources.templates.create = newTemplate;
			$scope.textResources.templates.edit = editTemplate;
			$scope.textResources.templates.singleHeader = singleHeaderTemplate;
			$scope.textResources.templates.singleFooter = singleFooterTemplate;
		};		
		
		$scope.initTextResourcesEasy = function(route, singular){
			if(!route || route == '') {
				route = $scope.currentRoute;
			}
			var plural = route.toUpperCase();
			if(!singular || singular == '') singular = plural.substring(0, plural.length - 1);
			var listTemplate = 'app/modules/' + route + '/list.html';
			var listItemTemplate = 'app/modules/' + route + '/list-item.html';
			var listHeaderTemplate = 'app/modules/' + route + '/list-header.html';
			var listFooterTemplate = 'app/modules/' + route + '/list-footer.html';
			var singleTemplate = 'app/modules/' + route + '/single.html';
			var singleHeaderTemplate = 'app/modules/' + route + '/single-header.html';
			var singleFooterTemplate = 'app/modules/' + route + '/single-footer.html';
		
			$scope.initTextResources(plural, singular, listTemplate, listItemTemplate, listHeaderTemplate, listFooterTemplate, singleTemplate, singleTemplate, singleHeaderTemplate, singleFooterTemplate);
		};
		
		$scope.setTitle = function(t, v){
			$scope.textResources.title[t] = v;
		};

		$scope.getTitle = function(t){
			switch (t) {
				case 'single':
					if($scope.getSingularTitle) return $scope.getSingularTitle();
					return $scope.textResources.title.single;
				case 'list':
					return $scope.textResources.title.list;
				default:
					return $scope.textResources.title.list;
			}
		};
		
		$scope.getTemplate = function(t){
			switch (t) {
				case 'edit':
					return $scope.textResources.templates.edit;	
				case 'new':
					return $scope.textResources.templates.create;	
				case 'list':
					return $scope.textResources.templates.list;	
				case 'list-item':
					return $scope.textResources.templates.listItem;	
				case 'list-header':
					return $scope.textResources.templates.listHeader;	
				case 'list-footer':
					return $scope.textResources.templates.listFooter;	
				case 'single-header':
					return $scope.textResources.templates.singleHeader;	
				case 'single-footer':
					return $scope.textResources.templates.singleFooter;	
				default:
					return '';	
			}
			
		};
		
		$scope.getTableHeaders = function(){
			var headers = [];
			if($scope.data.list && $scope.data.list.length > 0 && $scope.data.list[0]){
				headers = Object.getOwnPropertyNames($scope.data.list[0]);
			}
			return headers;
		};
		
		$scope.setListHeaders = function(headers){
			$scope.data.listHeaders = headers;
		};
		
		$scope.changeListHeaders = function(header, replacement){
			if($scope.data.listHeaders && $scope.data.listHeaders.indexOf(header) > -1){
				$scope.data.listHeaders[$scope.data.listHeaders.indexOf(header)] = replacement;
			}
		};
		
		 $scope.showDialog = function(ev, title, content, okText = "OK", cancelText = "Cancel", okHandler, cancelHandler) {
		    var confirm = $mdDialog.confirm()
		          .title(title)
		          .textContent(content)
		          .ariaLabel('')
		          .targetEvent(ev)
		          .ok(okText)
		          .cancel(cancelText);
		
		    $mdDialog.show(confirm).then(function() {
		      if(okHandler) okHandler();
		    }, function() {
		      if(cancelHandler) cancelHandler();
		    });
		  };
		  
		
		$scope.onErrorBase = function(obj){
	        $scope.showDialog(null, M.ERROR_TITLE, M.SAVED_ERROR, M.SAVED_OK, M.SAVED_CANCEL, function(){$scope.locked = false;}, function(){$location.path($scope.currentRoute)});			
		};

	    $scope.onSaveBase = function(obj){
	        $scope.showDialog(null, M.SAVED_TITLE, M.SAVED_MESSAGE, M.SAVED_OK, M.SAVED_CANCEL, function(){ $scope.newSingle(); }, function(){$location.path($scope.currentRoute)});
	    };

	    $scope.onUpdateBase = function(obj){
	        $scope.showDialog(null, M.SAVED_TITLE, M.SAVED_MESSAGE, M.SAVED_OK, M.SAVED_CANCEL, function(){}, function(){$location.path($scope.currentRoute)});
	    };
	    
	    $scope.beforeSaveBase = $scope.beforeUpdateBase = function(obj){
	        return (!Object.keys($scope.forms[$scope.currentRoute + "Form"].$error).length);
	    };
	    
	    $scope.goToEdit = function(){
	    	$location.path($scope.currentRoute + "/" + $scope.data.single.id);
	    };
	    
	    $scope.goToNew = function(){
	    	$location.path($scope.currentRoute + "/" + "new");
	    };
	    
	    //// PROJECT SPECIFIC FUNCTIONS START ////
	    
	    // message dialog for softDelete().
	    $scope.softDeleteDialog = function(obj){
	        $scope.showDialog(null, M.DELETE_TITLE, M.DELETE_MESSAGE, M.DELETE_YES, M.DELETE_NO, function(){ $scope.update(obj); }, function(){$location.path($scope.currentRoute)});			
		};
		
		// this function is use for delete data when is_delete field in db table.
    	$scope.softDelete = function(obj){
       		obj.is_deleted = 1;
    		$scope.softDeleteDialog(obj);
    	}
    	
    	// display only is_deleted=0 data (means not delete data).
    	$scope.beforeLoadAll = function(query){
    		query.is_deleted=0;
    		return query;
    	};
	    
	    //// PROJECT SPECIFIC FUNCTIONS END ////
	};
}
/*global app, ControllerFactory, RegisterRoutes, RegisterData*/
function RegisterEasyController(route, headers, controller){
	app.controller(route + 'ControllerBase', ControllerFactory(route));
	
	app.controller(route + 'Controller', function($scope, $controller, H) {
		//Copy all scope variables from Base Controller
		$controller(route + 'ControllerBase', {
			$scope: $scope
		});
		try{
			$controller(route + 'ControllerExtension', {
				$scope: $scope
			});
		} catch (ex){
			
		}
		
		$scope.initTextResourcesEasy();
		
		//$scope.setListHeaders(headers);
		
	});
}

//Register Easy Routes
(function(){
    var easyRoutes = RegisterRoutes().easyRoutes;
    //var data = RegisterData();
    
    for (var i = 0; i < easyRoutes.length; i++) {
        RegisterEasyController(easyRoutes[i]/*, data[easyRoutes[i]].headers*/);
    }
})();function RegisterMenuItems(){
    return [
        {
            header: '',
            showHeader: false,
            showSeparator: false,
            items: [
        	    {action: '', icon: 'home', color: 'blue', text: 'Home'}
	        ],
	        allowedRoles: ['user', 'admin', 'superadmin']
        },
        {
            header: '',
            showHeader: false,
            showSeparator: false,
            items: [
        	    {action: 'tasks', icon: 'assignment_turned_in', color: 'green', text: 'Tasks'},
        	    {action: 'members', icon: 'people', color: 'green', text: 'Members'},
        	    //{action: 'search', icon: 'search', color: 'brown', text: 'Search'},
        	     {action: '', icon: 'event_note', color:'green',text: 'Projects',
        	    	items : [
        	    		{action: 'manage_projects', icon: 'event_note', color: 'green', text: 'Manage Projects (New)'},
        	    		{action: 'projects', icon: '',text: 'Manage Projects (Old)'},
        	    		{action: 'releases', icon: '',text: 'Manage Release (Old)'},
        	    		{action: 'test_cases', icon: '',text: 'Test Cases (Old)'},
        	    		{action: 'test_plans', icon: '',text: 'Test Plans (Old)'},
        	    		{action: 'test_executions', icon: '',text: 'Test Executions (Old)'}
        	    	]
        	    },
        	    
        	    
        	    {action: '', icon: 'grid_on', color:'orange',text: 'Courses',
        	    	items : [
        	    		{action: 'modules', icon: '',text: 'Module'},
        	    		{action: 'manage_courses', icon: '',text: 'Manage Course'},
        	    		{action: 'manage_batches', icon: '',text: 'Manage Batches'}
        	    	]
        	    },
        	    
        	    {action: '', icon: 'question_answer', color:'brown',text: 'Quizzes',
        	    	items : [
        	    		{action: 'question_banks', icon: '',text: 'Question Bank'},
        	    		{action: 'question_sets', icon: '',text: 'Question Sets'},
        	    		{action: 'add_questions', icon: '',text: 'Add Question'},
						{action: 'manage_quizes', icon: '',text: 'Manage Quizes'},
						{action: 'schedule_quizes', icon: '',text: 'Schedule Quizes'}
        	    	]
        	    },
        	    
        	    {action: '', icon: 'time_to_leave', color:'blue',text: 'Leaves',
        	    	items : [
        	    		{action: 'company_holidays', icon: '',text: 'Holidays'},
        	    		{action: 'leave_requests', icon: '',text: 'My Leaves'},
        	    		{action: 'leaveRequests', icon: '',text: 'Response Leave'}
        	    	]
        	    },
        	    
        	    {action: 'reports', icon: 'pie_chart', color: 'purple', text: 'Reports'},
        	    
        	    {action: 'alerts', icon: 'alarm', color: 'red', text: 'Alerts'}
        	    
        	    // {action: '', icon: 'person', color:'cyan', text: 'Administrations',
        	    // 	items : [
        	    // 	    {action: 'profiles', icon: '',text: 'Profiles'},
        	    		
        	    // 	]
        	    // }
	        ],
	        allowedRoles: ['user', 'admin']
        },
        {
            header: 'Administration',
            showHeader: true,
            showSeparator: true,
            items: [
        	    {action: 'settings', icon: 'settings', color: 'yellow', text: 'Settings'},
        	    {action: 'categories', icon: 'list', color: 'orange', text: 'Categories'},
        	    {action: 'departments', icon: 'view_comfy', color:"", text: 'Departments'},
        	    {action: 'users', icon: 'person', color: 'blue', text: 'Users'},
        	    {action: 'groups', icon: 'group', color: 'green', text: 'Groups'}
	        ],
	        allowedRoles: ['admin']
        },
        {
            header: 'Customer Management',
            showHeader: false,
            showSeparator: false,
            items: [
        	    {action: 'organizations', icon: 'people_outline', color: '', text: 'Organizations'}
	        ],
	        allowedRoles: ['superadmin']
        }
    ];
}/*global app*/
app.service('M', function($http) {
	return {
		"E404": "The resource you are trying to access does not exist!",
		"E422": "Invalid parameters!",
		"E405": "Invalid operation!",
		"E400": "Bad request!",
		"E500": "An error accured!",
		"OUT_OF_SERVICE": "The system is under unscheduled maintenance! We'll be back soon.",
		"LOGIN_API_UNAVAILABLE": "Please contact the administrator. It seems that the login services are not enabled!",
		"REGISTER_API_UNAVAILABLE": "Please contact the administrator. It seems that the registration services are not enabled!",
		"SAAS_API_UNAVAILABLE": "Please contact the administrator. It seems that the SaaS services are not enabled!",
		"REQUIRED": "This field is required!",
		"INVALID_EMAIL": "Invalid email!",
		"UNAUTHORIZED_AREA": "You are not authorized to access this area!",
		"NA": "N/A",
		
		"DELETE_TITLE": "Item Delete!",
		"DELETE_MESSAGE" : "Are you sure you want delete the item?",
		"DELETE_YES" : "Yes",
		"DELETE_NO" : "No",
		
		"SAVED_TITLE": "Item Saved!",
		"SAVED_MESSAGE": "You have successfully saved this record!",
		"SAVED_OK": "Stay Here",
		"SAVED_CANCEL": "Go Back To Listing",
		"ERROR_TITLE": "Error!",
		"SAVED_ERROR": "An error occured while trying to save the object.",
		"RECOVERY_EMAIL_SENT": "We have sent instructions to your registered e-mail address. Please check your spam folder.",
		"REGISTRATION_EMAIL_SENT": "We have sent your request for approval. This usually takes upto 72 hours, but usually our approval panel is very quick to respond. You will soon get an activation email. Please keep checking your spam folder.",
		"PROFILE_SAVED": "Profile information updated successfully!",
		"PROFILE_SAVE_ERROR": "Could not save profile!",
		"PASSWORD_CHANGED": "Changed password successfully!",
		"PASSWORD_CHANGE_ERROR": "Could not change password!",
		"ADMIN_PASSWORD_REQUIRED": "Admin Password is required!",
		"PASSWORD_REQUIRED": "Password is required!",
		"PASSWORD_NOT_MATCHING": "Password and Confirm Password should match!",
		"TITLE_ADD_PREFIX": "ADD",
		"TITLE_EDIT_PREFIX": "EDIT",
		"TITLE_DASHBOARD": "DASHBOARD",
		"TITLE_LICENSE": "License",
		"TITLE_SETTINGS": "SETTINGS",
		"TITLE_ORGANIZATION_SETTINGS": "ORGANIZATION SETTINGS",
		"TITLE_MY_PROFILE": "MY PROFILE",
		"BTN_SAVE": "Save",
		"BTN_UPDATE": "Update",
		"BTN_EDIT": "Edit",
		"BTN_SUBMIT": "Submit",
		"BTN_OK": "OK",
		"BTN_CANCEL": "Cancel",
		"BTN_LOGIN": "Login",
		"BTN_RECOVER": "Recover",
		"BTN_REGISTER": "Register",
		"BTN_SHOW": "Show",
		"BTN_CHANGE_LICENSE": "Change License",
		"BTN_SET_PASSWORD": "Set Password",
		"BTN_ACTIVATE": "Activate",
		"HEADING_LOGIN": "Please, sign into your account",
		"HEADING_FORGOT_PASSWORD": "Forgot your password?",
		"HEADING_REGISTER": "Register now!",
		"LNK_REGISTER": "Register",
		"LNK_FORGOT_PASSWORD": "Forgot password?",
		"LNK_BACK_TO_LOGIN": "Back to Sign-in",
		"FIELD_EMAIL_ENTER": "Enter your email",
		"FIELD_PASSWORD_ENTER": "Enter your password",
		"FIELD_ORGANIZATION": "Organization",
		"FIELD_ROLE": "Role",
		"FIELD_EMAIL": "Email",
		"FIELD_USERNAME": "Username",
		"FIELD_PASSWORD": "Password",
		"FIELD_NEW_PASSWORD": "New Password",
		"FIELD_CONFIRM_PASSWORD": "Confirm Password",
		"FIELD_ADMIN_PASSWORD": "Admin Password",
		"FIELD_SUPERADMIN_PASSWORD": "Super Admin Password",
		"FIELD_CLIENT_SECRET": "Client Secret",
		"FIELD_VALIDITY": "Validity",
		"FIELD_LICENSE": "License",
		"FIELD_GROUPNAME": "Group Title",
		"FIELD_TITLE": "Title",
		"FIELD_DESCRIPTION": "Description",
		"FIELD_FIRST_NAME": "First Name",
		"FIELD_LAST_NAME": "Last Name",
		"FIELD_AGE": "Age",
		"FIELD_ADDR": "Address",
		"FIELD_ADDR1": "Address 1",
		"FIELD_ADDR2": "Address 2",
		"FIELD_GENDER": "Gender",
		"FIELD_ACTIVE": "Active",
		"FIELD_CATEGORY": "Category",
		
		"COMPANIES_FIELD_ORGANIZATIONNAME": "Organization Name",
		"COMPANIES_FIELD_DOMAINCODE":"Domain Code",
		"COMPANIES_FIELD_PRIMARYCONTACTPERSON":"Priary Contact Person",
		"COMPANIES_FIELD_SECONDARYCONTACTPERSON":"Secondary Contact Person",
		"COMPANIES_FIELD_PRIMARYCONTACTNO":"Primary Contact No",
		"COMPANIES_FIELD_SECONDARYCONTACTNO":"Secoundary Contact No",
		"COMPANIES_FIELD_EMAIL":"Email",
		"COMPANIES_FIELD_ADDRESS":"Address",
		"COMPANIES_FIELD_STATE":"State",
		"COMPANIES_FIELD_CITY":"City",
		"COMPANIES_FIELD_COUNTRY":"Country",
		"COMPANIES_FIELD_ZIPCODE":"Zip Code",
		"COMPANIES_FIELD_LOGO":"Logo",
		"COMPANIES_FIELD_DISPLAYTITLE":"Display Title",
		"COMPANIES_FIELD_SNNO":"SN No",
		"COMPANIES_FIELD_IS_ACTIVE":"Is Active",
		"COMPANIES_FIELD_ISDELETED":"Is Deleted",
		"COMPANIES_FIELD_GSTNO":"GST No",
		
		"COMPANY_HOLIDAYS_FIELD_HOLIDAYDATE":"Holiday Date",
		"COMPANY_HOLIDAYS_FIELD_DISCRIPTION":"Discription",
		"COMPANY_HOLIDAYS_FIELD_SUBJECT":"Subject",
		"COMPANY_HOLIDAYS_FIELD_MESSAGE":"Message",
		"COMPANY_HOLIDAYS_FIELD_IS_ACTIVE":"Is Active",
		"COMPANY_HOLIDAYS_FIELD_ISDELETED":"Is Deleted",
		"COMPANY_HOLIDAYS_FIELD_COMPANY":"Company",
		"COMPANY_HOLIDAYS_FIELD_TYPE":"Type",
		
		"COMPANY_MODULE_FIELD_COMPANY":"Company",
		"COMPANY_MODULE_FIELD_MODULE":"Module",
		"COMPANY_MODULE_FIELD_SUBMODULE":"Sub Module",
		"COMPANY_MODULE_FIELD_DISPLAYTITLE":"Display Title",
		"COMPANY_MODULE_FIELD_IS_ACTIVE":"Is Active",
		
		"ADD_QUESTIONS_FIELD_QB_ID":"Question Bank",
		"ADD_QUESTIONS_FIELD_QS_ID":"Question Set",
		
		"APPRECIATIONS_FIELD_FROM":"From",
		"APPRECIATIONS_FIELD_TO":"To",
		"APPRECIATIO_FIELD_TYPE":"Type",
		"APPRECIATIONS_FIELD_COMMENT":"Comment",
		"APPRECIATIONS_FIELD_APPRECIATIONDATE":"Appreciation Date",
		"APPRECIATIONS_FIELD_ISACTIVECOMMENT":"Is Active Comment",
		"APPRECIATIONS_FIELD_IS_ACTIVE":"Is Active",
		
		"ASSIGN_PROJECTS_FIELD_EMPLOYEE":"Employee",
		"ASSIGN_PROJECTS_FIELD_PROJECT":"Project",
		"ASSIGN_PROJECTS_FIELD_ESTIMATEDSTARTDATE":"Estimated Start Date",
		"ASSIGN_PROJECTS_FIELD_ESTIMATEDENDDATE":"Estimated End Date",
		"ASSIGN_PROJECTS_FIELD_ACTUALSTARTDATE":"Actual Start Date",
		"ASSIGN_PROJECTS_FIELD_ACTUALENDDATE":"Actual End Date",
		"ASSIGN_PROJECTS_FIELD_DAILYESTIMATEDHOURS":"Daily Estimated Hours",
		"ASSIGN_PROJECTS_FIELD_ESTIMATEDHOURS":"Estimated Hours",
		"ASSIGN_PROJECTS_FIELD_PROJECTROLE":"Project Role",
		"ASSIGN_PROJECTS_FIELD_REPORTINGUSER":"Reporting User",
		"ASSIGN_PROJECTS_FIELD_IS_ACTIVE":"Is Active",
		
		"CLIENTS_FIELD_NAME":"Name",
		"CLIENTS_FIELD_TIEUPDATE":"Tie up Date",
		"CLIENTS_FIELD_CONTACTPERSON":"Contact Person",
		"CLIENTS_FIELD_EMAIL":"Email",
		"CLIENTS_FIELD_PRIMARYCONTACTNO":"Primary Contact No",
		"CLIENTS_FIELD_SECONDARYCONTACTNO":"Secondary Contact No",
		"CLIENTS_FIELD_ADDRESS":"Address",
		"CLIENTS_FIELD_CITY":"City",
		"CLIENTS_FIELD_STATE":"State",
		"CLIENTS_FIELD_COUNTRY":"Country",
		"CLIENTS_FIELD_ZIPCODE":"Zipcode",
		"CLIENTS_FIELD_COMPANY":"Company",
		"CLIENTS_FIELD_IS_ACTIVE":"Is Active",
		
		"COURSE_MODULES_FIELD_COURSEID":"Course",
		"COURSE_MODULES_FIELD_MODULEID":"Module",
		"COURSE_MODULES_FIELD_IS_ACTIVE":"Is Active",
		
		"DEPARTMENTS_FIELD_TITLE":"Title",
		"DEPARTMENTS_FIELD_CONTACTNUMBER":"Contact Number",
		"DEPARTMENTS_FIELD_DESCRIPTION":"Description",
		"DEPARTMENTS_FIELD_COMPANY":"Company",
		"DEPARTMENTS_FIELD_STATUS":"Status",
		"DESIGNATION_FIELD_TITLE":"Title",
		"DESIGNATION_FIELD_COMPANY":"Company",
		"DESIGNATION_FIELD_IS_ACTIVE":"Is Active",
		
		"PROJECTS_FIELD_COMPANY":"Company",
		"PROJECTS_FIELD_PROJECTNAME":"Project Name",
		"PROJECTS_FIELD_PROJECTDESCRIPTION":"Project Description",
		"PROJECTS_FIELD_PROJECTOVERVIEW":"Project Overview",
		"PROJECTS_FIELD_ESTIMATEDSTARTDATE":"Estimated Start Date",
		"PROJECTS_FIELD_ESTIMATEDHOURS":"Estimated Hours",
		"PROJECTS_FIELD_DAILYESTIMATEDHOURS":"Daily Estimated Hours",
		"PROJECTS_FIELD_ESTIMATEDENDDATE":"Estimated End Date",
		"PROJECTS_FIELD_DEVURL":"Dev Url",
		"PROJECTS_FIELD_QAURL":"Qa Url",
		"PROJECTS_FIELD_POURL":"Po Url",
		"PROJECTS_FIELD_DEMOURL":"Demo Url",
		"PROJECTS_FIELD_LIVEURL":"Live Url",
		"PROJECTS_FIELD_CLIENT":"Client",
		"PROJECTS_FIELD_IS_ACTIVE":"Is Active",
		"PROJECTS_FIELD_VERSION":"Version",
		"PROJECTS_FIELD_TYPE":"Type",
		"PROJECTS_FIELD_IN_CHARGE":"In-charge",
		
		"RELEASES_FIELD_RELEASENO":"Release No",
		"RELEASES_FIELD_VERSIONNO":"Version No",
		"RELEASES_FIELD_RELEASEDATE":"Release Date",
		"RELEASES_FIELD_IS_ACTIVE":"Is Active",
		"RELEASES_FIELD_PROJECT_ID":"Project",
		
		"TEST_CASES_FIELD_TESTCASENO":"Testcase No",
		"TEST_CASES_FIELD_BACKLOGID":"Backlog",
		"TEST_CASES_FIELD_TESTCASEDESCRIPTION":"Test Case Description",
		"TEST_CASES_FIELD_ACCESSPATH":"Access Path",
		"TEST_CASES_FIELD_PRECONDITION":"Precondition",
		"TEST_CASES_FIELD_TESTSTEP":"Test Step",
		"TEST_CASES_FIELD_TESTDATA":"Test Data",
		"TEST_CASES_FIELD_EXPECTEDRESULT":"Expected Result",
		"TEST_CASES_FIELD_CREATIONDATE":"Creation Date",
		"TEST_CASES_FIELD_EXECUTIONDATE":"Execution Date",
		"TEST_CASES_FIELD_STATUS":"Status",
		"TEST_CASES_FIELD_REMARK":"Remark",
		"TEST_CASES_FIELD_IS_ACTIVE":"Is Active",
		
		"TEST_PLANS_FIELD_BACKLOGID":"Backlog",
		"TEST_PLANS_FIELD_TESTCASEID":"Test Case",
		"TEST_PLANS_FIELD_ESTIMATEDHOURS":"Estimated Hours",
		"TEST_PLANS_FIELD_VERSIONNAME":"Version Name",
		"TEST_PLANS_FIELD_RELEASEDATE":"Release Date",
		"TEST_PLANS_FIELD_BUGVERIFICATION":"Bug Verification",
		"TEST_PLANS_FIELD_STATUSID":"Status",
		"TEST_PLANS_FIELD_IS_ACTIVE":"Is Active",
		
		"TEST_EXECUTIONS_FIELD_TESTCASEID":"Test Case",
		"TEST_EXECUTIONS_FIELD_BACKLOGID":"Backlog",
		"TEST_EXECUTIONS_FIELD_TESTPLANID":"Test Plan",
		"TEST_EXECUTIONS_FIELD_ESTIMATEDHOURS":"Estimated Hours",
		"TEST_EXECUTIONS_FIELD_COMMENTS":"Comments",
		"TEST_EXECUTIONS_FIELD_STATUSID":"Status",
		"TEST_EXECUTIONS_FIELD_IS_ACTIVE":"Is Active",
		
		"USER_STORIES_FIELD_TITLE":"Title",
		"USER_STORIES_FIELD_STATUSID":"Status",
		"USER_STORIES_FIELD_USERSTORY":"User Story",
		"USER_STORIES_FIELD_IS_ACTIVE":"Is Active",
		
		"DOCUMENTS_FIELD_TITLE":"Title",
		"DOCUMENTS_FIELD_TYPE":"Type",
		"DOCUMENTS_FIELD_FILE":"File",
		"DOCUMENTS_FIELD_EMPLOYEE":"Employe",
		"DOCUMENTS_FIELD_COMPANY":"Commpany",
		"DOCUMENTS_FIELD_IS_ACTIVE":"Is Active",
		
		"EMPLOYEES_FIELD_EMPLOYEENUMBER":"Employe Number",
		"EMPLOYEES_FIELD_FIRSTNAME":"First Name",
		"EMPLOYEES_FIELD_LASTNAME":"Last Name",
		"EMPLOYEES_FIELD_DISPLAYNAME":"Display Name",
		"EMPLOYEES_FIELD_JOINDATE":"Join Date",
		"EMPLOYEES_FIELD_LEAVEDATE":"Leave Date",
		"EMPLOYEES_FIELD_BIRTHDATE":"Birth Date",
		"EMPLOYEES_FIELD_DEPARTMENT":"Department",
		"EMPLOYEES_FIELD_DESIGNATION":"Designation",
		"EMPLOYEES_FIELD_ROLE":"Role",
		"EMPLOYEES_FIELD_CONTACTNUMBER":"Contact Number",
		"EMPLOYEES_FIELD_EMERGENCYNUMBER":"Emergency Number",
		"EMPLOYEES_FIELD_PRIMARYEMAIL":"Primary Email",
		"EMPLOYEES_FIELD_SECONDARYEMAIL":"Secondary Email",
		"EMPLOYEES_FIELD_ADDRESS":"Address",
		"EMPLOYEES_FIELD_COMPANY":"Company",
		"EMPLOYEES_FIELD_PASSWORD":"Password",
		"EMPLOYEES_FIELD_STATE":"State",
		"EMPLOYEES_FIELD_COUNTRY":"Country",
		"EMPLOYEES_FIELD_ZIPCODE":"Zip Code",
		"EMPLOYEES_FIELD_CITY":"City",
		"EMPLOYEES_FIELD_ISPRIMARY":"Is Primary",
		"EMPLOYEES_FIELD_PROFILEPICTURE":"Profile Picture",
		"EMPLOYEES_FIELD_IS_ACTIVE":"Is Active",
		
		"QUESTION_BANKS_FIELD_QUS":"Question",
		"QUESTION_BANKS_FIELD_OPTION1":"Option1",
		"QUESTION_BANKS_FIELD_OPTION2":"Option2",
		"QUESTION_BANKS_FIELD_OPTION3":"Option3",
		"QUESTION_BANKS_FIELD_OPTION4":"Option4",
		"QUESTION_BANKS_FIELD_ANS":"Answer",
		"QUESTION_BANKS_FIELD_COURSEID":"Course",
		"QUESTION_BANKS_FIELD_IS_ACTIVE":"Is Active",
		
		"LEAVE_REQUESTS_FIELD_FROMID":"From Employe",
		"LEAVE_REQUESTS_FIELD_TOID":"To Employe",
		"LEAVE_REQUESTS_FIELD_CCEMAIL":"CCemail",
		"LEAVE_REQUESTS_FIELD_MESSAGE":"Message",
		"LEAVE_REQUESTS_FIELD_STARTDATE":"Start Date",
		"LEAVE_REQUESTS_FIELD_ENDDATE":"End Date",
		"LEAVE_REQUESTS_FIELD_TYPE":"Type",
		"LEAVE_REQUESTS_FIELD_LEAVESTATUS":"Leave Status",
		"LEAVE_REQUESTS_FIELD_IS_ACTIVE":"Is Active",
		"LEAVE_REQUESTS_FIELD_REASON":"Reason",
		"LEAVE_REQUESTS_FIELD_ISPAID":"Is Paid",
		
		"MODULES_FIELD_TITLE":"Title",
		"MODULES_FIELD_STATUS":"Status",
		
		"PROJECTS_FIELD_ENTER_PROJECTS_DETAILS":"Enter Project Details",
		"TASKS_FIELD_ENTER_TASK_DETAILS":"Enter Task Details",
		"TASKS_FIELD_ASSIGNEE_ID":"Assignee Id",
		"TASKS_FIELD_REPORTER_ID":"Reporter Id",
		"TASKS_FIELD_TASK_DETAILS":"Task Details",
		"TASKS_FIELD_STATUS":"Status",
		"TASKS_FIELD_MID":"Mid",
		"TASKS_FIELD_TASK_TITLE":"Task Title",
		"TASKS_FIELD_TASK_PRIORITY":"Task Priority",
		
		"MILESTONES_FIELD_ENTER_MILESTONE_DETAILS":"Enter MileStone Details",
		"MILESTONES_FIELD_MILESTONE_NAME":"Enter Milestone Name",
		"MILESTONES_FIELD_ESTIMATEDSTARTDATE":"Planned Start Date",
		"MILESTONES_FIELD_ESTIMATEDENDDATE":"Estimated End Date",
		"MILESTONES_FIELD_STATUS":"Status",
		"MILESTONES_FIELD_FLAG":"Milestone Flag",
		"MILESTONES_FIELD_PID":" ENTER Pid",
		
		"MANAGE_COURSES_FIELD_TITLE":"Title",
		"MANAGE_COURSES_FIELD_DESCRIPTION":"Description",
		"MANAGE_COURSES_FIELD_MODULEID":"Module",
		"MANAGE_COURSES_FIELD_DURATION":"Duration",
		"MANAGE_COURSES_FIELD_DURATIONTYPEID":"Duration Type",
		"MANAGE_COURSES_FIELD_STATUSID":"Status",
		"MANAGE_COURSES_FIELD_IS_ACTIVE":"Is Active",
		
		"MANAGE_BATCHS_FIELD_TITLE":"Title",
		"MANAGE_BATCHS_FIELD_STARTDATE":"Start Date",
		"MANAGE_BATCHS_FIELD_ENDDATE":"End Date",
		"MANAGE_BATCHS_FIELD_COURSEID":"Course",
		"MANAGE_BATCHS_FIELD_STATUSID":"Status",
		"MANAGE_BATCHS_FIELD_IS_ACTIVE":"Is Active",
		
		"QUESTION_SETS_FIELD_TITLE":"Title",
		"QUESTION_SETS_FIELD_IS_ACTIVE":"Is Active",
		
		"MANAGE_QUIZES_FIELD_QUESETID":"Question set",
		"MANAGE_QUIZES_FIELD_DATE":"Date",
		"MANAGE_QUIZES_FIELD_USERID":"User",
		"MANAGE_QUIZES_FIELD_IS_ACTIVE":"Is Active",
		
		"SCHEDULE_QUIZES_FIELD_QUESETID":"Question set",
		"SCHEDULE_QUIZES_FIELD_DATE":"Date",
		"SCHEDULE_QUIZES_FIELD_USERID":"User",
		"SCHEDULE_QUIZES_FIELD_IS_ACTIVE":"Is Active",
		
		"PROFILES_FIELD_USER":"User",
		"PROFILES_FIELD_EMPLOYEENUMBER":"Employe Number",
		"PROFILES_FIELD_FIRSTNAME":"First Name",
		"PROFILES_FIELD_LASTNAME":"Last Name",
		"PROFILES_FIELD_DISPLAYNAME":"Display Name",
		"PROFILES_FIELD_JOINDATE":"Join Date",
		"PROFILES_FIELD_LEAVEDATE":"Leave Date",
		"PROFILES_FIELD_BIRTHDATE":"Birth Date",
		"PROFILES_FIELD_DEPARTMENT":"Department",
		"PROFILES_FIELD_DESIGNATION":"Designation",
		"PROFILES_FIELD_ROLE":"Role",
		"PROFILES_FIELD_CONTACTNUMBER":"Contact Number",
		"PROFILES_FIELD_EMERGENCYNUMBER":"Emergency Number",
		"PROFILES_FIELD_PRIMARYEMAIL":"Primary Email",
		"PROFILES_FIELD_SECONDARYEMAIL":"Secondary Email",
		"PROFILES_FIELD_ADDRESS":"Address",
		"PROFILES_FIELD_COMPANY":"Company",
		"PROFILES_FIELD_PASSWORD":"Password",
		"PROFILES_FIELD_STATE":"State",
		"PROFILES_FIELD_COUNTRY":"Country",
		"PROFILES_FIELD_ZIPCODE":"Zip Code",
		"PROFILES_FIELD_CITY":"City",
		"PROFILES_FIELD_ISPRIMARY":"Is Primary",
		"PROFILES_FIELD_PROFILEPICTURE":"Profile Picture",
		"PROFILES_FIELD_IS_ACTIVE":"Is Active",
		
		"ALERTS_FIELD_MODULES_ID":"Modules",
		"ALERTS_TO_EMAIL":"To Email",
		"ALERTS_CC_EMAIL":"cc Email",
		"ALERTS_IS_ACTIVE":"Active",
		"ALERTS_FIELD_MODULES_FIELDS":"Select Fields",
		"ALERTS_FIELD_OPERATORS":"Select Operator",
		"ALERTS_VALUE":"Enter Compare Value"
	};
});function RegisterRoutes() {
    return {
        customRoutes: [
            {route: '', template: 'home/template', controller: 'home'},
            {route: 'sign-in', template: 'auth/sign-in', controller: 'auth', auth: false},
            {route: 'forgot-password', template: 'auth/forgot-password', controller: 'auth', auth: false},
            {route: 'register', template: 'auth/register', controller: 'auth', auth: false},
            {route: 'profile', template: 'auth/profile', controller: 'profile'},
            {route: 'unauthorized', template: 'auth/unauthorized', controller: 'unauthorized'},
            {route: 'out-of-service', template: 'auth/out-of-service', controller: 'outOfService', auth: false},
            {route: 'settings', template: 'settings/template', controller: 'settings'},
            //////////////////////////////////////////////////////////////////////////////
            {route: 'companies', template: 'auth/companies', controller: 'companies'},
            
             {route: 'manage_projects', template: 'auth/manage_projects', controller: 'manage_projects'},
            
            {route: 'company_holidays', template: 'auth/company_holidays', controller: 'company_holidays'},
            {route: 'company_modules', template: 'auth/company_modules', controller: 'company_modules'},
            {route: 'add_questions', template: 'auth/add_questions', controller: 'add_questions'},
            {route: 'appreciations', template: 'auth/appreciations', controller: 'appreciations'},
            {route: 'assign_projects', template: 'auth/assign_projects', controller: 'assign_projects'},
            {route: 'clients', template: 'auth/clients', controller: 'clients'},
            {route: 'course_modules', template: 'auth/course_modules', controller: 'course_modules'},
            {route: 'departments', template: 'auth/departments', controller: 'departments'},
            {route: 'designations', template: 'auth/designations', controller: 'designations'},
            {route: 'projects', template: 'auth/projects', controller: 'projects'},
            {route: 'releases', template: 'auth/releases', controller: 'releases'},
            {route: 'test_cases', template: 'auth/test_cases', controller: 'test_cases'},
            {route: 'test_plans', template: 'auth/test_plans', controller: 'test_plans'},
            {route: 'test_executions', template: 'auth/test_executions', controller: 'test_executions'},
            {route: 'user_stories', template: 'auth/user_stories', controller: 'user_stories'},
            {route: 'documents', template: 'auth/documents', controller: 'documents'},
            {route: 'employees', template: 'auth/employees', controller: 'employees'},
            {route: 'question_banks', template: 'auth/question_banks', controller: 'question_banks'},
            {route: 'leave_requests', template: 'auth/leave_requests', controller: 'leave_requests'},
            {route: 'modules', template: 'auth/modules', controller: 'modules'},
            {route: 'manage_courses', template: 'auth/manage_courses', controller: 'manage_courses'},
            {route: 'manage_batches', template: 'auth/manage_batches', controller: 'manage_batches'},
            {route: 'question_sets', template: 'auth/question_sets', controller: 'question_sets'},
            {route: 'manage_quizes', template: 'auth/manage_quizes', controller: 'manage_quizes'},
            {route: 'schedule_quizes', template: 'auth/schedule_quizes', controller: 'schedule_quizes'},
            {route: 'search', template: 'auth/search', controller: 'search'},
            {route: 'reports', template: 'auth/reports', controller: 'reports'},
            {route: 'alerts', template: 'auth/alerts', controller: 'alerts'}
        ],
        easyRoutes: ['organizations', 'users', 'groups', 'categories', 'tasks',
        			'profiles', 'departments','projects','companies','company_holidays','company_modules',
        			'add_questions','appreciations','assign_projects','clients','course_modules','designations','releases',
        			'test_cases','test_plans','test_executions','user_stories','documents','employees','question_banks',
        			'leave_requests','modules','manage_courses','manage_batches','question_sets','manage_quizes',
        			'schedule_quizes','search','reports','alerts','members','manage_projects']
    };
}/*global app*/
app.service('S', function($http) {
	return {
		"baseUrl": "../../../../../prestige/api",
		"productName": "weSuite",
		"supportEmail": "support@prestigeframework.com",
		"enableSaaS": true,
		"openRegistration": true,
		"legacyMode": false
	}
});/*global app, RegisterRoutes*/
app.service('H', function($location, md5, S, M, R) {
	return {
		S: S,
		SETTINGS: S,
		M: M,
		MESSAGES: M,
		R: R,
		RESOURCES: R,
		getCookieKey: function(){
			var absUrl = $location.absUrl();
			Helper.getCookieKey(absUrl);
		},
		getHash: function(str){
    		return md5.createHash(str);
		},
		getAbsolutePath: Helper.getAbsolutePath,
		getRandomNumber: Helper.getRandomNumber,
		getUUID: Helper.getUUID,
		toDateTime: Helper.toDateTime,
		toMySQLDateTime: Helper.toMySQLDateTime,
		checkLicenseValidity: Helper.checkLicenseValidity,
		getOpenRoutes: function(){
			var openRoutes = RegisterRoutes().customRoutes.filter(p => p.auth === false);
			var openRouteNames = [];
			openRoutes.forEach(p => openRouteNames.push("/" + p.route));
			return openRouteNames;
		},
		toTitleCase: Helper.toTitleCase,
		replaceAll: Helper.replaceAll
	};
});

class Helper {

	constructor() {
	}

	static getCookieKey(absUrl) {
		var startIndex = absUrl.indexOf("//") + 2;
		var endIndex = absUrl.indexOf("#");
		var base = absUrl.substring(startIndex, endIndex);
		var pattern = /[\s:/!@#\$%\^\&*\)\(+=.-]/g;
		var key = base.replace(pattern, "_");
		return key;
	}
	
	static getAbsolutePath(href) {
	    var link = document.createElement("a");
	    link.href = href;
	    return link.href;
	}

	static getRandomNumber(min, max) {
    	return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	static getUUID() {
	      var id = '', i;
	
	      for(i = 0; i < 36; i++)
	      {
	        if (i === 14) {
	          id += '4';
	        }
	        else if (i === 19) {
	          id += '89ab'.charAt(this.getRandomNumber(0,3));
	        }
	        else if(i === 8 || i === 13 || i === 18 || i === 23) {
	          id += '-';
	        }
	        else
	        {
	          id += '0123456789abcdef'.charAt(this.getRandomNumber(0, 15));
	        }
	      }
	      return id;
	}
	
	static toDateTime(str){
		// Split timestamp into [ Y, M, D, h, m, s ]
		var t = str.split(/[- :]/);
		
		// Apply each element to the Date function
		var d = new Date(Date.UTC(t[0], t[1]-1, t[2], t[3], t[4], t[5]));
		
		return d;
	}
	
	static toMySQLDateTime(dt){
		return dt.getUTCFullYear() + "-" + Helper.twoDigits(1 + dt.getUTCMonth()) + "-" + Helper.twoDigits(dt.getUTCDate()) + " " + Helper.twoDigits(dt.getUTCHours()) + ":" + Helper.twoDigits(dt.getUTCMinutes()) + ":" + Helper.twoDigits(dt.getUTCSeconds());
	}
	
	static twoDigits(d) {
	    if(0 <= d && d < 10) return "0" + d.toString();
	    if(-10 < d && d < 0) return "-0" + (-1*d).toString();
	    return d.toString();
	}
	
	static checkLicenseValidity(organization){
		return ((new Date() > Helper.toDateTime(organization.validity) && !(['basic', 'super'].indexOf(organization.license) > -1))  || !organization.is_active ) ? 'expired' : 'valid';
	}
	
	static toTitleCase(input){
		input = input || '';
		return input.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	}
	
	static replaceAll(input, search, replacement){
		input = input || '';
		return input.replace(new RegExp(search, 'g'), replacement);
	}

}/*global app*/
//Service for quickly getting the API Resource Object
app.service('R', function($resource, $http, S) {
	return {
		get: function(resourceName) {
			return $resource(S.baseUrl + '/' + resourceName + '/:id', {
				id: '@id'
			});
		},
		count: function(resourceName, cb) {
			$http.get(S.baseUrl + '/' + resourceName + '/?count=true')
				.then(function(results) {
					if (results && results.data && results.data.length > 0)
						if (cb) cb(results.data[0].count);
				}, function(e) {});
		}
	};
});/*global app*/
app.directive('focusOn', ['$timeout',
    function ($timeout) {
        var checkDirectivePrerequisites = function (attrs) {
          if (!attrs.focusOn && attrs.focusOn != "") {
                throw "FocusOn missing attribute to evaluate";
          }
        };

        return {            
            restrict: "A",
            link: function (scope, element, attrs, ctrls) {
                checkDirectivePrerequisites(attrs);

                scope.$watch(attrs.focusOn, function (currentValue, lastValue) {
                    if(currentValue == true) {
                        $timeout(function () {    
                            element.focus();
                        });
                    }
                });
            }
        };
    }
]);/*global app*/
app.directive('spinner', function($rootScope) {
  return {
    scope: {
      size: '='
    },
    restrict: 'E',
    replace: true,
    template: '<img src="images/spinner.gif" ng-if="$root.loading" style="width:13px;height:13px"></img>'
  };
});/*global app, Helper*/
app.filter('checkLicenseValidity', function() {
    return function(organization) {
        return Helper.checkLicenseValidity(organization);
        //return new Date();
    };
});/*global app*/
app.filter('lowerCase', function() {
    return function(input) {
      input = input || '';
      return input.replace(/\w\S*/g, function(txt){return txt.toLowerCase();});
    };
});  /*global app*/
app.filter('titleCase', function() {
    return function(input) {
      input = input || '';
      return input.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    };
});/*global app, Helper*/
app.filter('toDateTime', function() {
    return function(str) {
        return Helper.toDateTime(str);
    };
});/*global app*/
app.filter('upperCase', function() {
    return function(input) {
      input = input || '';
      return input.replace(/\w\S*/g, function(txt){return txt.toUpperCase();});
    };
});/*global app*/
app.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);/*global app*/
app.component('infoBox', {
	templateUrl: 'app/components/infobox/template.html',
	controller: 'infoboxController',
	bindings: {
		options: '<',
	}
});

app.controller('infoboxController', function($scope){
	// $scope.options = {
	// 	title: 'options.title',
	// 	value: 'options.value',
	// 	icon: 'options.icon',
	// 	background: 'bgblueish',
	// 	color: 'white-text',
	// 	action: 'options.action'
	// };

	var self = this;
	self.$onInit = function(){
		if(self.options){
			$scope.options = self.options;
		}
	};
	
});/*global app, $, M*/
app.component('modal', {
	templateUrl: 'app/components/modal/template.html',
	controller: 'modalController',
	bindings: {
		options: '=',
	}
});

app.controller('modalController', function($scope){
	var self = this;
	self.$onInit = function(){
		if(self.options){
			$scope.options = self.options;
			$scope.options.open = openModal;
		}
		else{
			$scope.options = {};
			$scope.options.open = openModal;
		}
	};
	
	$(function(){
		self.modal = M.Modal.init(document.querySelector('#mdmodal'));
	});

	function openModal(options){
		if(options){
			$scope.options = options;
			$scope.options.open = openModal;
		}
		
		self.modal.open();
	}

});/*global app*/
app.component('time', {
	templateUrl: 'app/components/time/template.html',
	controller: 'timeController',
	bindings: {
		value: '<',
		label: '<'
	}
});

app.controller('timeController', function($scope){
	// $scope.options = {
	// 	title: 'options.title',
	// 	value: 'options.value',
	// 	icon: 'options.icon',
	// 	background: 'bgblueish',
	// 	color: 'white-text',
	// 	action: 'options.action'
	// };

	var self = this;
	self.$onInit = function(){
		if(self.value){
			$scope.value = self.value;
			$scope.hh = $scope.value.substring(1, 3);
			$scope.mm = $scope.value.substring(4);
		}
		else{
			$scope.hh = "00";
			$scope.mm = "00";
		}
		if(self.label){
			$scope.label = self.label;
		}
	};
	
});app.controller('add_questionsControllerExtension', function($scope, $controller, $rootScope, $http, $location, $mdDialog, H, M) {
     $rootScope.hideButton = false;
    var urlQuestionbank = H.SETTINGS.baseUrl + '/question_banks';
    	$http.get(urlQuestionbank)
        	.then(function(r){
            	$scope.Questionbankdata = r.data;
        	},function(e){
        		if(e && e.data && e.data.error && e.data.error.status){
        			newItem.error = e.data.error.message ? e.data.error.message : e.data.error.status;    
        		}
        	});
        	
        	
     var urlQuestionSet = H.SETTINGS.baseUrl + '/question_sets';
    	$http.get(urlQuestionSet)
        	.then(function(r){
            	$scope.QuestionSetdata = r.data;
        	},function(e){
        		if(e && e.data && e.data.error && e.data.error.status){
        			newItem.error = e.data.error.message ? e.data.error.message : e.data.error.status;    
        		}
        	});
});app.controller('alertsControllerExtension', function($scope, $controller, $rootScope, $http, $location, $mdDialog, H, M) {
    
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
});/*global app*/
app.controller('authController', function($scope, $rootScope, $http, $location, $cookies, H, M, S) {
	if($rootScope.currentUser){
		$location.path('/');
	}
	
	$scope.forms = {};
	
	$scope.H = H;
	$scope.M = M;
	$scope.S = S;
	
	$scope.data = {};
	
	//$scope.loading = false;

	$scope.login = function(){
		//$scope.loading = true;
		$http.post(H.SETTINGS.baseUrl + '/users/login', {email: $scope.email, password: $scope.password})
			.then(function(r){
				$scope.error = "";
				if(!r.data.token){
					$scope.error = M.E500;
					//$scope.loading = false;
					return;
				}
				$rootScope.currentUser = r.data;
				$cookies.putObject(H.getCookieKey(), JSON.stringify(r.data));
				$location.path('/');
			}, function(e){
				if(e && e.data && e.data.error && e.data.error.status){
					if(e.data.error.code == 404 && e.data.error.message == "Not Found"){
						$scope.error = M.LOGIN_API_UNAVAILABLE;
					} else {
						$scope.error = e.data.error.message ? e.data.error.message : e.data.error.status;	
					}
					
				}
				//$scope.loading = false;
			});
	};

	$scope.forgotPassword = function(){
		//$scope.loading = true;
		$http.post(H.SETTINGS.baseUrl + '/users/forgot-password', {email: $scope.email})
			.then(function(r){
				$scope.error = M.RECOVERY_EMAIL_SENT;
				//$scope.loading = false;
			}, function(e){
				if(e && e.data && e.data.error && e.data.error.status){
					if(e.data.error.code == 404 && e.data.error.message == "Not Found"){
						$scope.error = M.LOGIN_API_UNAVAILABLE;
					} else {
						$scope.error = e.data.error.message ? e.data.error.message : e.data.error.status;
					}
				}
				//$scope.loading = false;
			});
	};

	$scope.register = function(){
		var route = 'users';
		var data = {username: $scope.data.username, email: $scope.data.email, password: $scope.data.password};
		if(S.enableSaaS) {
			route = 'organizations'; 
			data = {organization: $scope.data.organization, email: $scope.data.email};
		}else{
			if($scope.data.password != $scope.data.confirmPassword){
				$scope.error = "Password and Confirm Password should match!";
				return;
			}
		}
		
		$http.post(H.SETTINGS.baseUrl + '/' + route +'/register', data)
			.then(function(r){
				$scope.error = M.REGISTRATION_EMAIL_SENT;
			}, function(e){
				if(e && e.data && e.data.error && e.data.error.status){
					if(e.data.error.code == 404 && e.data.error.message == "Not Found"){
						$scope.error = M.REGISTER_API_UNAVAILABLE;
					} else {
						$scope.error = e.data.error.message ? e.data.error.message : e.data.error.status;
					}
				}
			});
	};
	
	$scope.logout = function(){
		$cookies.remove(H.getCookieKey());
		delete $rootScope.currentUser;
		$location.path('/sign-in');
	};
});


/*global app*/
app.controller('outOfServiceController', function($scope, H){
	$scope.H = H;
	$scope.M = H.M;
});
/*global app*/
app.controller('profileController', function($scope, $rootScope, $http, $cookies, H, M){
	$scope.H = H;
	$scope.M = H.M;
	
	$scope.locked = true;
	$scope.lockedClass = "hidden";
	$scope.editingClass = "";
	
	$scope.forms = {};
	$scope.userData = {};
	$scope.passwordData = {};

	$scope.disableEdit = function(){
		$scope.locked = true;
		$scope.lockedClass = "hidden";
		$scope.editingClass = "";
	}
	
	$scope.edit = function(){
		$scope.locked = false;
		$scope.editingClass = "float-left";
		$scope.lockedClass = "visible float-right formClass";
	
		$scope.userData.username = $rootScope.currentUser.username;
		$scope.userData.email = $rootScope.currentUser.email;
		$scope.userData.role = $rootScope.currentUser.role;
	};
	
	$scope.updateHandler = function(r){
				$scope.userData.message = H.M.PROFILE_SAVED;
				var user = r.data;
				user.password = $rootScope.currentUser.password;
				user.organization = $rootScope.currentUser.organization;
				$rootScope.currentUser = user;
				$cookies.putObject(H.getCookieKey(), JSON.stringify($rootScope.currentUser));
	}
	
	$scope.save = function(){
		$scope.userData.error = "";
		$scope.userData.message = "";
		$http.get(H.S.baseUrl + '/users/' + $rootScope.currentUser.id).then(function(res){
			var r = res.data;
			r.username = $scope.userData.username;
			r.email = $scope.userData.email;
			r.role = $scope.userData.role;
			
			if(H.S.legacyMode){
				$http.post(H.S.baseUrl + '/users/update', r).then(function(r){
					$scope.updateHandler(r);
				}, function(e){
					$scope.userData.error = H.M.PROFILE_SAVE_ERROR;
				});
			} else {
				$http.put(H.S.baseUrl + '/users', r).then(function(r){
					$scope.updateHandler(r);
				}, function(e){
					$scope.userData.error = H.M.PROFILE_SAVE_ERROR;
				});
			}
		},function(e){
			$scope.userData.error = H.M.PROFILE_SAVE_ERROR;
		});
	};
	
	$scope.changePassword = function(){
		$scope.passwordData.error = "";
		$scope.passwordData.message = "";
		if($scope.passwordData.newPassword != $scope.passwordData.confirmPassword){
			$scope.passwordData.error = M.PASSWORD_NOT_MATCHING;
			return;
		}
		var data = {
			email: $rootScope.currentUser.email,
			password: $scope.passwordData.password,
			new_password: $scope.passwordData.newPassword
		};
		$http.post(H.S.baseUrl + '/users/change-password', data).then(function(res){
			$scope.passwordData.message = H.M.PASSWORD_CHANGED;
		},function(e){
			$scope.passwordData.error = H.M.PASSWORD_CHANGE_ERROR + " " + e.data.error.message;
		});
	};	
});/*global app*/
app.controller('unauthorizedController', function($scope, H){
	$scope.H = H;
	$scope.M = H.M;
});
/*global app*/
//The name of the controller should be plural that matches with your API, ending with ControllerExtension. 
//Example: your API is http://localhost:8080/api/categories then the name of the controller is categoriesControllerExtension.
//To register this controller, just go to app/config/routes.js and add 'categories' in 'easyRoutes' array.
app.controller('categoriesControllerExtension', function($scope, $controller, $rootScope, $http, $location, $mdDialog, H, M) {
    
         $rootScope.hideButton = false;
    //This function is called when you need to make changes to the new single object.
    $scope.onInit = function(obj){
        //$scope.data.single is available here. 'obj' refers to the same. It is the new instance of your 'categories' resource that matches the structure of your 'categories' API.
        obj.is_active = 1;
    };
    
    //This function is called when you are in edit mode. i.e. after a call has returned from one of your API that returns a single object. e.g http://localhost:8080/api/categories/1
    $scope.onLoad = function(obj){
        //$scope.data.single is available here. 'obj' refers to the same. It represents the object you are trying to edit.
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
        $scope.changeListHeaders('Category', 'Parent Category');
        
        console.log(parseInt(($scope.data.records - 1)/ $scope.data.limit));
    };
    
    //This function is called before the create (POST) request goes to API
    $scope.beforeSave = function(obj, next){
        //You can choose not to call next(), thus rejecting the save request. This can be used for extra validations.
        next();
    };

    //This function is called after the create (POST) request is returned from API
    $scope.onSave = function (obj, next){
        //You can choose not to call next(), thus preventing the page to display the popup that confirms the object has been created.
        next();
    };
    
    //This function is called before the update (PUT) request goes to API
    $scope.beforeUpdate = function(obj, next){
        delete obj.category;
        //You can choose not to call next(), thus rejecting the update request. This can be used for extra validations.
        next();
    };

    //This function is called after the update (PUT) request is returned from API
    $scope.onUpdate = function (obj, next){
        //You can choose not to call next(), thus preventing the page to display the popup that confirms the object has been updated.
        next();
    };
    
    //This function will be called whenever there is an error during save/update operations.
    $scope.onError = function (obj, next){
        //You can choose not to call next(), thus preventing the page to display the popup that confirms there has been an error.
        next();
    };
    
    $scope.getSingularTitle = function(){
        return M.FIELD_CATEGORY.toUpperCase();
    };
    
    H.R.get('categories').query({}, function(r){
        $scope.data.categories = r;
    });
    
    

});/*global app, RegisterMenuItems*/
app.controller('navController', function($scope) {
    var data = RegisterMenuItems();
    
    for(var k in data){
        if(data.hasOwnProperty(k) && data[k].items && data[k].items.length > 0){
            for (var i = 0; i < data[k].items.length; i++) {
                data[k].items[i].action = '#!' + data[k].items[i].action;
                if(data[k].items[i].color) data[k].items[i].color = "col-" + data[k].items[i].color;
                if(data[k].items[i].items && data[k].items[i].items.length > 0){
                    data[k].items[i].action = '';
                    for (var j = 0; j < data[k].items[i].items.length; j++) {
                        data[k].items[i].items[j].action = '#!' + data[k].items[i].items[j].action;
                        if(data[k].items[i].items[j].color) data[k].items[i].items[j].color = "col-" + data[k].items[i].items[j].color;
                    }
                }
            }
        }
    }
    $scope.data = data;
});/*global app*/
app.controller('titleController', function($scope, S){
   $scope.title =  S.productName;
});/*global angular, app*/
app.controller('company_holidaysControllerExtension', function($scope, $controller, $rootScope, $http, $location, $mdDialog, H, M) {
    $rootScope.hideButton = false;
    $scope.removeListHeaders = function(){
    	return ['is_deleted']
    }
    
    var url = H.SETTINGS.baseUrl + '/companies';
    	$http.get(url)
        	.then(function(r){
            	$scope.companyname = r.data;
        	},function(e){
        		if(e && e.data && e.data.error && e.data.error.status){
        			newItem.error = e.data.error.message ? e.data.error.message : e.data.error.status;    
        		}
        	});
       
    
       $scope.newDate = function(Date){
       		$scope.data.single.holiday_date = H.toMySQLDateTime(Date);
    	};
    	
     // 	$scope.beforeLoadAll = function(query){
    	// 	query.is_deleted=0;
    	// 	return query;
    	// };
});/*global angular, app*/
app.controller('departmentsControllerExtension', function($scope, $controller, $rootScope, $http, $location, $mdDialog, H, M) {
    $rootScope.hideButton = false;
    var url = H.SETTINGS.baseUrl + '/companies';
    	$http.get(url)
        	.then(function(r){
            	$scope.companyname = r.data;
        	},function(e){
        		if(e && e.data && e.data.error && e.data.error.status){
        			newItem.error = e.data.error.message ? e.data.error.message : e.data.error.status;    
        		}
        	});
    
    $scope.removeListHeaders = function(){
		return ['is_deleted'];
    }
    	
    // $scope.onLoadAll = function(obj){
    // 	$scope.setListHeaders(['Title','Contact Number','Description','Companies','Status']);
    // };
    
});/*global angular, app, $*/
app.controller('groupsControllerExtension', function($scope, $controller, $rootScope, $http, $q, $location, $mdDialog, H, M) {
    if(!(['admin', 'superadmin'].indexOf($rootScope.currentUser.role) > -1)){
        $location.path('unauthorized');
    }
         $rootScope.hideButton = false;

    $scope.UserGroups = H.R.get('user_groups');
    $scope.Users = H.R.get('users');
    $scope.loadUsers = function(){
        $scope.Users.query({}, function(r){
            $scope.users = r;    
            var usersList = {};
            $scope.users.map(function(p){
                usersList[p.username] = "images/user.png";
            });
            $scope.data.usersList = usersList;
        });
    };
    $scope.loadUserGroups = function(groupId, callback){
        $scope.UserGroups.query({group_id: groupId}, function(r){
            $scope.data.groupUsers = r;
            if(callback) callback();
        });
    };
    
    $scope.getUsers = function(searchText){
        return $http.get(H.S.baseUrl + '/users?username[in]=' + searchText)
            .then(function(r){
                return r.data;
            });
        //return $scope.data.users.filter(p => p.username.includes(searchText));
    };

    $scope.onInit = function(obj){
        obj.is_active = 1;
        $scope.loadUsers();
    };
    
    $scope.onLoad = function(obj){
        $scope.loadUsers();
        $scope.loadUserGroups(obj.id);
    };
    
    if(!$scope.data.groupUsersAdd) $scope.data.groupUsersAdd = [];
    if(!$scope.data.groupUsersRemove) $scope.data.groupUsersRemove = [];
    
    $scope.removeGroupUser = function(user){
        
        var justAdded = $scope.data.groupUsersAdd.filter(p => p.user_id == user.user_id && p.group_id == user.group_id);
        if(justAdded.length == 1){
            var justAddedIndex = $scope.data.groupUsersAdd.indexOf(justAdded[0]);
            if(justAddedIndex > -1){
                $scope.data.groupUsersAdd.splice(justAddedIndex, 1);    
            }
        } else {
            $scope.data.groupUsersRemove.push(user);
        }
        var userIndex = $scope.data.groupUsers.indexOf(user);
        if(userIndex > -1){
            $scope.data.groupUsers.splice(userIndex, 1);    
        }
        // $scope.loading = true;
        // $scope.delete(item, function(r){
        //     $scope.loading = false;
        //     // $scope.UserGroups.query({group_id: $scope.data.single.id}, function(r){
        //     //     $scope.data.groupUsers = r;
        //     // });
        // });
    };
    
    $scope.addGroupUser = function(user){
        if($scope.data.single.id && user){
            var ug = new $scope.UserGroups();
            ug.user_id = user.id;
            ug.group_id = $scope.data.single.id;
            var ugl = new $scope.UserGroups();
            ugl.user_id = user.id;
            ugl.group_id = $scope.data.single.id;
            ugl.user = user;
            
            var notExistsInAdd = $scope.data.groupUsersAdd.filter(p => p.user_id == ug.user_id && p.group_id == ug.group_id).length == 0;
            var notExistsInMain = $scope.data.groupUsers.filter(p => p.user_id == ug.user_id && p.group_id == ug.group_id).length == 0;
            var removeMembers = $scope.data.groupUsersRemove.filter(p => p.user_id == ug.user_id && p.group_id == ug.group_id);
            var existsInRemove = removeMembers.length == 1;
            var notExistsInRemove = removeMembers.length == 0;
            
            if(notExistsInAdd && notExistsInMain && notExistsInRemove){
                $scope.data.groupUsersAdd.push(ug);
                $scope.data.groupUsers.push(ugl);
            } else {
                if(existsInRemove){
                    var removeIndex = $scope.data.groupUsersRemove.indexOf(removeMembers[0]);
                    if(removeIndex > -1){
                        $scope.data.groupUsersRemove.splice(removeIndex, 1);
                        $scope.data.groupUsers.push(ugl);
                    }
                }
            }
            // $scope.save(ug, function(r){
            //     if(!((r && r.data && r.data.error) || (r && r.error))){
            //         $scope.data.groupUsers.push(r);    
            //     }
            // });
        }
    };
    
    $scope.onUpdate = function(obj, next){
        var promises = [];
        if($scope.data.groupUsersAdd.length > 0){debugger
            promises.push($scope.post('user_groups',$scope.data.groupUsersAdd));
        }
        if($scope.data.groupUsersRemove.length > 0){
            var ids = $scope.data.groupUsersRemove.map(p => p.id);
            promises.push($scope.deleteMany('user_groups', ids));
        }
        if(promises.length > 0){
            $q.all(promises).then(function(r){
                if(r.error){
                    $scope.onErrorBase(r.error);
                } else {
                    $scope.loadUserGroups(obj.id, function(){
                        $scope.data.groupUsersAdd = [];
                        $scope.data.groupUsersRemove = [];
                        next();
                    });
                }
            });
        }
    };

    $scope.onSave = function(result, next){
        if(result && result.id){
            // var UserGroups = H.R.get('user_groups');
            // for (var i = 0; i < $scope.data.groupUsers.length; i++) {
            //     var ug = new $scope.UserGroups();
            //     ug.user_id = $scope.data.groupUsers[i].id;
            //     ug.group_id = result.id;
            //     $scope.save(ug);
                
            // }
                next();
        } else {
            next();
        }
        
    };
    
    
    
});/*global app*/
app.controller('homeController', function ($scope, $rootScope, H, R) {

	// $controller('homeControllerBase', {
	// 	$rootScope:$rootScope
	// });
	$('.collapsible').collapsible();
	$scope.H = H;
	$scope.M = H.M;

	$scope.data = {
		counters: {
			organizationsCounter: {
				title: 'Organizations',
				value: '...',
				icon: 'people_outline',
				background: 'bg-green',
				color: 'white-text',
				action: 'organizations',
				allowedRoles: ['superadmin']
			},
			usersCounter: {
				title: 'Users',
				value: '...',
				icon: 'person',
				background: 'bg-purple',
				color: 'white-text',
				action: 'users',
				allowedRoles: ['admin']
			},
			groupsCounter: {
				title: 'Groups',
				value: '...',
				icon: 'group',
				background: 'bg-pink',
				color: 'white-text',
				action: 'groups',
				allowedRoles: ['admin']
			},
			departmentsCounter: {
				title: 'Departments',
				value: '...',
				icon: 'view_comfy',
				background: '',
				color: '',
				action: 'departments',
				allowedRoles: ['admin']
			},
			profilesCounter: {
				title: 'Profiles',
				value: '...',
				icon: 'account_circle',
				background: 'bg-orange',
				color: 'white-text',
				action: 'profiles',
				allowedRoles: ['admin']
			},
			tasksCounter: {
				title: 'Tasks',
				value: '...',
				icon: 'assignment_turned_in',
				background: 'bg-green',
				color: 'white-text',
				action: 'tasks',
				allowedRoles: ['user', 'admin']
			},
			projectsCounter: {
				title: 'Projects',
				value: '...',
				icon: 'event_note',
				background: 'bg-brown',
				color: 'white-text',
				action: 'projects',
				allowedRoles: ['user', 'admin']
			}
		},
		bgColors: [
			"bg-blue",
			"bg-red",
			"bg-teal",
			"bg-orange",
			"bg-cyan",
			"bg-brown",
			"bg-pink",
			"bg-purple",
			"bg-green"
			// "bg-light-blue",
			// "bg-amber",
			// "bg-lime",
			// "bg-yellow",
			// "bg-indigo",
			// "bg-grey",
		]

	};
	
	function getNextNumber(n) {
		var m = n % $scope.data.bgColors.length;
		return m;
	}
	
	function randomizeTileColors() {
		var count = 0;
		for(var key in $scope.data){
			if($scope.data.hasOwnProperty(key)){
				var val = $scope.data[key];
				if(val.hasOwnProperty('background')){
					val.background = $scope.data.bgColors[getNextNumber(count)];
				}
				count++;
			}
		}
	}
	
	function setCount(resourceName, counterName) {
		R.count(resourceName, function (result) {
			$scope.data.counters[counterName].value = result;
		});
	}
	
	function setCounts(resources) {
		for (var i = 0; i < resources.length; i++) {
			var resourceName = resources[i];
			var counterName = resourceName + 'Counter';
			setCount(resourceName, counterName);
		}
	}
	
	function setCountsDefault(){
		var resources = [];
		for (var k in $scope.data.counters) {
			var v = $scope.data.counters[k];
			if(v.allowedRoles.indexOf($rootScope.currentUser.role) > -1){
				resources.push(v.action);
			}
		}
		setCounts(resources);
	}
	
	$rootScope.currentPage = 1;
	
	
	//Random colors for each tile
	//randomizeTileColors();
	
	//Set counts for each tile
	//setCounts(["tasks", "users"]);
	
	//Set counts for each tile automatically, considering the name of the action and the path of the API is same
	setCountsDefault();


});
/*global angular, app*/
app.controller('leave_requestsControllerExtension', function($scope, $controller, $rootScope, $http, $location, $mdDialog, H, M) {
    
    $scope.removeListHeaders = function(){
		return ['is_deleted'];
    }
         $rootScope.hideButton = false;
    $scope.onLoadAll = function(obj){
    	$scope.setListHeaders(['From','To','cc Email','Message','Start Date','End Date','Type','Leave Status','Status','Reason','Is Paid']);
    };
    
    var urlEmployee = H.SETTINGS.baseUrl + '/employees';
    	$http.get(urlEmployee)
        	.then(function(r){
            	$scope.EmployeeData = r.data;
        	},function(e){
        		if(e && e.data && e.data.error && e.data.error.status){
        			newItem.error = e.data.error.message ? e.data.error.message : e.data.error.status;    
        		}
        	});
        	
    $scope.newstartDate = function(Date){
    	$scope.data.single.start_date = H.toMySQLDateTime(Date);
    };
    $scope.newendDate = function(Date){
    	$scope.data.single.end_date = H.toMySQLDateTime(Date);
    };
    
    
    
});/*global angular, app*/
app.controller('manage_batchesControllerExtension', function($scope, $controller, $rootScope, $http, $location, $mdDialog, H, M) {
    $rootScope.hideButton = false;
    var urlmanageCourses = H.SETTINGS.baseUrl + '/manage_courses';
    	$http.get(urlmanageCourses)
        	.then(function(r){
            	$scope.manageCoursesdata = r.data;
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
       
    
       $scope.newstartDate = function(Date){
       		$scope.data.single.start_date = H.toMySQLDateTime(Date);
    	};
    $scope.newendDate = function(Date){
       		$scope.data.single.end_date = H.toMySQLDateTime(Date);
    	};
    	
});/*global angular, app*/
app.controller('manage_coursesControllerExtension', function($scope, $controller, $rootScope, $http, $location, $mdDialog, H, M) {
    
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
});/*global angular, app*/

app.config(function($routeProvider) {
    $routeProvider

    .when("/load_milestones", {
        templateUrl : "/load_milestones.html",
        controller : "load_milestonesCtrl"
    });
});
app.controller("load_milestonesCtrl", function ($scope) {
    $scope.msg = "Data has been added!!";
});

app.controller('manage_projectsControllerExtension', function($scope,$route ,$controller, $rootScope, $http, $location,$mdSidenav, $mdDialog,$window, H, M) {
  
  $rootScope.hideButton = true;
   $scope.removeListHeaders = function(){
      return ['is_deleted']
    }
  
  $scope.selectedIndex = -1;
  
  //Milestone status
  $scope.Status = [
  {value:"Released"},
  {value:"Un-released"},
  {value:"Archieved"}
  ]
  
  $scope.Flag = [
  {value:"Internal"},
  {value:"External"}
  ]
  
  $scope.Task_Status = [
  {value:"Done"},
  {value:"Not Done"}
  ]
  
  $scope.Priority = [
  {value:"None"},
  {value:"Low"},
  {value:"Medium"},
  {value:"High"},
  ]
  
  $scope.enable_add_task = false;
  $scope.checked = 0;
  $scope.myproject_Id = 0;
  $scope.MID = 0;
  $scope.task_value = 0;
  $scope.task_list_id = 0;
  $scope.show_tasks = false;
  $scope.show_milestones = false;
  $scope.row_data = false;
       
       
       console.log("page load");
       $scope.update_data = {};
       $scope.insert = function(){
        var data={};
        data = {
               clients_id:$rootScope.clients_id,
             project_name: $rootScope.project_name,
             project_description:$rootScope.project_description,
             estimated_start_date:$rootScope.estimated_start_date,
             estimated_end_date:$rootScope.estimated_end_date,
             version:$rootScope.version,
             type:$rootScope.flag,
      }
      //console.log("data",data)
      $http.post(H.SETTINGS.baseUrl+'/projects',data).then(function successCallback(response) {
        document.getElementById('myProject').reset()
      $mdDialog.show(
        $mdDialog.alert()
        .parent(angular.element(document.querySelector('#popupContainer')))
        .clickOutsideToClose(true)
        .title('Project Adding')
        .textContent('Project was added Succesfully!')
        .ariaLabel('Project Adding')
        .ok('OK')
        
      );
      
      /* $scope.reload = function(){
        var urlClient = H.SETTINGS.baseUrl + '/projects';
        $http.get(urlClient)
          .then(function(r){
            $scope.Clientdata = r.data;
            
          },function(e){
            if(e && e.data && e.data.error && e.data.error.status){
              newItem.error = e.data.error.message ? e.data.error.message : e.data.error.status;    
            }
          });
      }; */
      $scope.reload();
      var promise = $interval($scope.reload, 1000);
      $interval.cancel(promise);
      }, function errorCallback(response) {
      console.log('project was not added Succesfully')
      });
      $mdSidenav('project').close();
      }
   
   	
   	
	$scope.delete_data1 = function(id1){
						$http({
						method : 'PUT',
						url : H.SETTINGS.baseUrl+'/projects',
						data : {
							"id" : id1,
							"is_deleted" : "1"
							},
						header : 'Content-Type: application/json; charset=UTF-8'
					}).then(function(response){
						var isdelete = response.status;
						if(isdelete == 200)
						{
							console.log("Project Deleted");
							$route.reload();
						}
						else
						{
							console.log("Project Not Deleted");
						}
					});
	};
					
	$http({
            method : 'GET',
            url : H.SETTINGS.baseUrl + '/users?role=admin',
            header : 'Content-Type: application/json; charset=UTF-8'
        }).then(function(response){
     $scope.admin_incharge = response.data;
     
     /*console.log("========");
     console.log($scope.admin_incharge);
     console.log("========");*/
        });
        
        $http({
            method : 'GET',
            url : H.SETTINGS.baseUrl + '/users',
            header : 'Content-Type: application/json; charset=UTF-8'
        }).then(function(response){
     $scope.allusers_reporter = response.data;
     
     /*console.log("++++++++");
     console.log($scope.allusers_reporter);
     console.log("++++++++");*/
        });
        
	$scope.updateTask = function(update_id){
		
		/*console.log(update_id);*/
		$mdSidenav('update_task').open();
        $http({
        	method:"GET",
        	url:H.SETTINGS.baseUrl + '/tasks?id='+update_id+'',
        	header : 'Content-Type: application/json; charset=UTF-8'
        }).then(function(response){
        	/*var data1 = JSON.stringify(response.data);*/
        	var data1 = response.data[0];
        	console.log(data1);
        	/*console.log(response.data[0].reporter.display_name);
        	console.log(response.data[0].assignee.display_name);*/
        	/*var get_title = data1.title;
        	var get_task_details = data1.task_details;
        	var get_start_date = data1.start_date;	
        	var get_end_date = data1.end_date;
        	var get_priority = data1.priority;
        	var get_task_status = data1.task_status;
        	var get_in_charge = data1.display_name;
        	var get_reporter_display_name = response.data[0].reporter.display_name;
        	var get_assignee_display_name = response.data[0].assignee.display_name;*/
        	
        	/*console.log(get_title);
        	console.log(get_task_details);
        	console.log(get_start_date);
        	console.log(get_end_date);
        	console.log(get_priority);
        	console.log(get_task_status);
        	console.log(get_reporter_display_name);
        	console.log(get_assignee_display_name);*/
        	
        	
        	$scope.update_data.get_title = data1.title;
        	$scope.update_data.get_task_details = data1.task_details;
        	
        	$scope.update_data.get_priority = data1.priority;
        	$scope.update_data.get_task_status = data1.task_status;
        	$scope.update_data.get_in_charge = data1.display_name;
        	
        	$scope.update_data.get_reporter_id = response.data[0].reporter.id;
        	$scope.update_data.get_reporter_display_name = response.data[0].reporter.display_name;
        	
        	$scope.update_data.get_assignee_id = response.data[0].assignee.id;
        	$scope.update_data.get_assignee_display_name = response.data[0].assignee.display_name;
        	$scope.update_data.get_start_date = data1.start_date;	
        	$scope.update_data.get_end_date = data1.end_date;
        	
        	/*var get_start_date = data1.start_date;
        	var convert_start_date = new Date(get_start_date);	
        	
        	var get_end_date = data1.end_date;
        	var convert_end_date = new Date(get_end_date);	*/
        	
        	
        	/*console.log(response.data[0].assignee.id);
        	console.log(response.data[0].reporter.id);*/
        	/*$scope.get_start_date =  convert_start_date;	
        	$scope.get_end_date = convert_end_date;*/
        });  
        
   		$scope.save_updated_task = function(insert_data)
   		{
   			
   			console.log(insert_data.get_title);
   			console.log(insert_data.get_task_details);
   			console.log(insert_data.get_reporter_id);
   			console.log(insert_data.get_assignee_id);
   			console.log(insert_data.get_start_date);
   			console.log(insert_data.get_end_date);
   			console.log(insert_data.get_priority);
   			console.log(insert_data.get_task_status);
   			
	   	$http({
			method:"PUT",
				url:H.SETTINGS.baseUrl+'/tasks/'+update_id+'', /*api_key=a0f16ffb39162569c38ab644efd4300d*/
				data:
				{
					"title":insert_data.get_title,
					"task_details":insert_data.get_task_details,
					"reporter_id":insert_data.get_reporter_id,
					"assignee_id":insert_data.get_assignee_id,
					"start_date":insert_data.get_start_date,
					"end_date":insert_data.get_end_date,
					"priority":insert_data.get_priority,
					"task_status":insert_data.get_task_status
				},
				header : 'Content-Type: application/json; charset=UTF-8'
	   		}).then(function(response){
				var isdelete = response.status;
				if(isdelete == 200)
				{
					console.log("Task Updated");
					$route.reload();
				}
				else
				{
					console.log("Task Not Updated");
				}
			});
	};
	};
					
	$scope.delete_milestone = function(id){
		$http({
			method:"PUT",
			url:H.SETTINGS.baseUrl + '/milestones',
			data : {
				"id" : id,
				"is_deleted" : "1"
			},
			header : 'Content-Type: application/json; charset=UTF-8'
		}).then(function(response){
			var isdelete = response.status;
			if(isdelete == 200)
			{
				console.log("Milestone Deleted");
				$route.reload();
			}
			else
			{
				console.log("Milestone Not Deleted");
			}
		});
	};
	
	
      //console.log('project was not added Succesfully')
      
      });
      
      document.getElementById('myProject').reset();
      $mdSidenav('project').close();
      
    
     
       }
       
       //update projects
       $scope.updateProject = function(id){
        $mdSidenav('updateProject').open();
    /*     $scope.closeUpdateSlieder = function(){
          $mdSidenav('updateProject').close();
          document.getElementById('update_form_id').reset(); */
        //}
         //console.log("Update id"+id);
         $http({
          method : 'GET',
          url : H.SETTINGS.baseUrl + '/projects/'+id,
          header : 'Content-Type: application/json; charset=UTF-8'
        }).then(function(response){
          //console.log("Updated Data"+JSON.stringify(response.data));
          $rootScope.project_name_update = response.data.project_name;
          $rootScope.clients_id_update = response.data.clients_id;
          $rootScope.project_description_update = response.data.project_description;
          $rootScope.estimated_start_date_update = response.data.estimated_start_date;
          $rootScope.estimated_end_date_update = response.data.estimated_end_date;
          $rootScope.version_update = response.data.version;
          $rootScope.flag_update = response.data.type;
         });

       //to save updated records of projects
        $scope.saveProject = function(){
        $http({
          method : 'put',
          url : H.SETTINGS.baseUrl+'/projects/'+id,
          header : 'Content-Type: application/json; charset=UTF-8',
          data: {
            "project_name" : $rootScope.project_name_update,
            "clients_id" : $rootScope.clients_id_update,
            "project_description" : $rootScope.project_description_update,
            "estimated_start_date" : $rootScope.estimated_start_date_update,
            "estimated_end_date" : $rootScope.estimated_end_date_update,
            "version" : $rootScope.version_update,
            "type" : $rootScope.flag_update,
          }
        }).then(function(response){
          var isvalid = response.status;
          if(isvalid == 200){
            //alert("Updated");
            $route.reload();

          }
          else{
            alert("Something went wrong");
          }
        });
       } 
      }

     
       
   
   $scope.delete_data = function(id)
   {
   	console.log(id);
            /*$http.put(H.SETTINGS.baseUrl+"/tasks/"+ id, {*/
            	$http.put(H.SETTINGS.baseUrl+'/tasks/', {'id': id,"is_deleted":"1"})
                .then(function success(data) {
                   
                   //Below line displays all the tasks of selected milestone. It doesn't handle the task list
                    
                    	
                    	$http.get(H.SETTINGS.baseUrl+'/tasks?is_deleted=0&MID='+$scope.MID).then(function successCallback(response) {

                      $scope.tasks = response.data;
                      
                      }, function errorCallback(response) {});
          
                }, function error(){});
   }
        
    $scope.show_tasks = false;
    $scope.show_milestones = false;
  
  
    $scope.getDetails = function(v){
    console.log("india "+v)
      $scope.milestones = null;
      $scope.show_tasks = false;
      $scope.row_data = false;
      var id = event.target.id;
      $scope.myproject_Id = id;
      if($scope.project_Id != id ){
        $scope.project_Id = id;
        
        
        $http.get(H.SETTINGS.baseUrl+'/milestones?PID='+id+'&is_deleted=0').then(function successCallback(response) {
        	
        	
        $scope.milestones = response.data;
        
     // console.log($scope.milestones[0].id)
      //  $scope.getReleases($scope.milestones[0].id);
      }, function errorCallback(response) {

      $scope.project = response.data;
      //console.log(response);
    
      });
      }
      else{
        $scope.project_Id = 0;        
    }
    
    }

     
    $http.get(H.SETTINGS.baseUrl+'/employees').then(function(response){
      $scope.emp_responsible = response.data;
      
      //console.log("Employee "+JSON.stringify($scope.emp_responsible));
    });
    $scope.addMilestone = function(evnt){ 
      
          var mydata = {
        milestone_name :$rootScope.milestone_name,
      estimated_start_date:$rootScope.estimated_start_date,
          estimated_end_date:$rootScope.estimated_end_date,
          status_value:$rootScope.status_value,  
        eid : $scope.user_id,
      flag:$rootScope.flag
      }
      $http.post(H.SETTINGS.baseUrl+'/milestones',mydata).then(function successCallback(response) {
      $http.get(H.SETTINGS.baseUrl+'/milestones?PID='+$scope.myproject_Id).then(function successCallback(response) {
                $scope.milestones = response.data;
                 }, function errorCallback(response) {});
      var tabs = $scope.milestones;
      $scope.tabs = tabs;
      tabs.push(mydata)
      
      $mdDialog.show(
        $mdDialog.alert()
        .parent(angular.element(document.querySelector('#popupContainer')))
        .clickOutsideToClose(true)
        .title('Milestone Adding')   
        .textContent('Milestone added Succesfully!')
        .ariaLabel('New Milestone')
        .ok('OK')
            .openFrom({
          top: -50,
          width: 30,
          height: 80
        })
        .closeTo({
          left: 1500
        })
        
        
      );
      document.getElementById('myMilestone').reset();
      
      
      }, function errorCallback(response) {
      console.log('Milestone was not added Succesfully')
      
      });
    $mdSidenav('milestone').close();
    }
  
  $scope.addTaskList = function(evnt){
          var data = {
        pid:$scope.myproject_Id,
      name:$rootScope.task_list,
      mid:$scope.MID
      }
      $http.post(H.SETTINGS.baseUrl+'/project_lists',data).then(function successCallback(response) {
        
      $mdDialog.show(
        $mdDialog.alert()
        .parent(angular.element(document.querySelector('#popupContainer')))
        .clickOutsideToClose(true)
        .title('Task List Adding')
        .textContent('Task List added Succesfully!')
        .ariaLabel('New Task List')
        .ok('OK')
        );
      
      
      }, function errorCallback(response) {}
      );
    }
    
    $scope.addTask = function(evnt){
     var tl = $rootScope.task_list;
   if(tl == null){
     $rootScope.task_list = 0;
   }
       var data={};
      data={
       title:$rootScope.task_title,
       assignee_id: $rootScope.assignee_id,
       reporter_id : $rootScope.reporter_id,
       project_lists_id: $rootScope.task_list,
       task_details:$rootScope.task_details,
       task_status:$rootScope.task_status,
       priority:$rootScope.priority,
       MID:$scope.MID,
     }
     $http.post(H.SETTINGS.baseUrl+'/tasks',data).then(function successCallback(response) {
     document.getElementById('myTask').reset()
     $mdDialog.show(
       $mdDialog.alert()
       .parent(angular.element(document.querySelector('#popupContainer')))
       .clickOutsideToClose(true)
       .title('Task Adding')
       .textContent('Task was added Succesfully!')
       .ariaLabel('New Task')
       .ok('OK')

     );

     //Automatically display the recently added task

     var string = ""+$scope.task_value;
     if(string.localeCompare("undefined") != 0){
       $http.get(H.SETTINGS.baseUrl+'/tasks?MID='+$scope.MID+'&project_lists_id='+$scope.task_value).then(function successCallback(response) {
       $scope.tasks = response.data;
       //console.log($scope.tasks.length)
       }, function errorCallback(response) {
           //console.log("Not added")
       $scope.project = response.data;
       });
     }
     else{
       $http.get(H.SETTINGS.baseUrl+'/tasks?MID='+$scope.MID).then(function successCallback(response) {
       $scope.tasks = response.data;
       //console.log($scope.tasks.length)
       }, function errorCallback(response) {
           //console.log("Not added")
       $scope.project = response.data;
       });
     }

     }, function errorCallback(response) {});

     $mdSidenav('task').close();
   }
    
  $scope.newTaskList = function(evnt) {
        
        //console.log($scope.MID)
               $mdDialog.show ({
                  clickOutsideToClose: true,
          
                  scope: $scope,        
                  preserveScope: true,           
                  templateUrl: 'add_task_list.html',
                  controller: function DialogController($scope, $mdDialog) {
                     $scope.closeDialog = function() {
                        $mdDialog.hide();
                     }
                  }
               });
            };      
  
    $scope.cancel = function(){$mdDialog.cancel();}
    
    $scope.getTasks = function( mile, pl){
   
    $scope.show_tasks = true;
      $scope.task_list_id = pl;
      //console.log('MID is '+mile+' task list id is '+pl)
      var id = event.target.id;
      
      if($scope.milestone_Id != id ){
        $scope.milestone_Id = id;
      $scope.show_tasks = false;
      $scope.task_value = pl;
      $scope.MID = mile;
      var string = ""+pl;
      
      if(string.localeCompare('undefined') != 0){
        $http.get(H.SETTINGS.baseUrl+'/tasks?is_deleted=0&MID='+mile+'&project_lists_id='+pl).then(function successCallback(response) {
        $scope.tasks = response.data;
        $scope.show_tasks = true;

        //console.log($scope.tasks.length)
        }, function errorCallback(response) {
        
        $scope.project = response.data;
        });
      }
      else{
        $http.get(H.SETTINGS.baseUrl+'/tasks?is_deleted=0&MID='+mile).then(function successCallback(response) {
        $scope.tasks = response.data;
        $scope.show_tasks = true;

        //console.log($scope.tasks.length)
        }, function errorCallback(response) {
        
        $scope.project = response.data;
        });
      }
    
    }
      else{
        $scope.milestone_Id = 0;
      $scope.show_tasks = false;
    }
    $scope.checked = $scope.milestone_Id;
    //console.log('mid is '+id)
      
      
      
    }
  
  $scope.getReleases = function(v){
    $scope.milestonesSelectedIndex = -1;
    $scope.show_tasks = false;
    $scope.getTasks(v,"undefined")
      $scope.newtask = true;
      
      var id = event.target.id;
      console.log(v+" is id")
    
  
      $scope.MID = v;
      
      $http.get(H.SETTINGS.baseUrl+'/project_lists?mid='+v).then(function successCallback(response) {
        $scope.Releases = response.data;
      //console.log($scope.Releases)
      $scope.show_tasks = true;

      }, function errorCallback(response) {
      
      $scope.project = response.data;
      });
    
      
    }

    //get users(admin) as in-charge in dropdown control
    
    $http({
			method : 'GET',
			url : H.SETTINGS.baseUrl + '/users?role=admin',
			header : 'Content-Type: application/json; charset=UTF-8'
		}).then(function(response){
      $scope.inCharges = response.data;
      //console.log("Admin users: "+JSON.stringify($scope.inCharges));
		});

    
    //var urlClient = H.SETTINGS.baseUrl + '/projects';
    var urlClient = H.SETTINGS.baseUrl + '/projects/?is_deleted[in]=0';
      $http.get(urlClient)
          .then(function(r){
              $scope.Clientdata = r.data;
            //console.log("This is it : "+JSON.stringify($scope.Clientdata));
          },function(e){
            if(e && e.data && e.data.error && e.data.error.status){
              newItem.error = e.data.error.message ? e.data.error.message : e.data.error.status;    
            }
          });
      
    var urlUsers = H.SETTINGS.baseUrl + '/employees';
      $http.get(urlUsers)
          .then(function(r){
              $scope.Users = r.data;
        
        
          },function(e){
            if(e && e.data && e.data.error && e.data.error.status){
              newItem.error = e.data.error.message ? e.data.error.message : e.data.error.status;    
            }
          });
          
          
          var urlUsers1 = H.SETTINGS.baseUrl + '/employees';
      $http.get(urlUsers)
          .then(function(r1){
              $scope.Users1 = r1.data;
      /*  console.log("-=-=-=");
        console.log($scope.Users1);
        console.log("-=-=-=");*/
        
          },function(e){
            if(e && e.data && e.data.error && e.data.error.status){
              newItem.error = e.data.error.message ? e.data.error.message : e.data.error.status;    
            }
          });
    
    
       $scope.newestimatedStartDate = function(Date){
          $scope.data.single.estimated_start_date = H.toMySQLDateTime(Date);
      };
      $scope.newestimatedEndDate = function(Date){
          $scope.data.single.estimated_end_date = H.toMySQLDateTime(Date);
      };
    
    $scope.newMilestone = function() {
               $mdSidenav('milestone').toggle();
            };
    
    $scope.closeMilestone = function(){
      $mdSidenav('milestone').close();
      document.getElementById('myMilestone').reset()
    }
    

    //update milestone
    $scope.update_Milestone = function(id){
      $mdSidenav('updateMilestone').open();
      //console.log("Milestone id :"+id);

      $http({
        method : 'GET',
        url : H.SETTINGS.baseUrl + '/milestones/'+id,
        header : 'Content-Type: application/json; charset=UTF-8'
      }).then(function(response){
        //console.log("Updated Data"+JSON.stringify(response.data));
        $rootScope.milestone_name_update = response.data.milestone_name;
        $rootScope.estimated_start_date_update = response.data.estimated_start_date;
        $rootScope.estimated_end_date_update = response.data.estimated_end_date;
        $rootScope.status_value_update = response.data.status_value;
        $rootScope.flag_update = response.data.flag;
       }); 
      

    //to save updated records of milestone
    $scope.saveMilestone = function(){
      $http({
        method : 'put',
        url : H.SETTINGS.baseUrl+'/milestones/'+id,
        header : 'Content-Type: application/json; charset=UTF-8',
        data: {
          "milestone_name" : $rootScope.milestone_name_update
          
        }
      }).then(function(response){
        var isvalid = response.status;
        if(isvalid == 200){
          alert("Updated");
          $route.reload();

        }
        else{
          alert("Something went wrong");
        }
      });
     } 
    }

    $scope.closeUpdateMilestone = function(){
      $mdSidenav('updateMilestone').close();
      document.getElementById('updateMilestone_form_id').reset();
    }
    
    $scope.newTask = function() {
        $rootScope.task_list = $scope.task_list_id;
        $scope.blocked_value = "true";
        //console.log($scope.task_list_id+ " is my value")
               $mdSidenav('task').toggle();
            };
      
    $scope.newTaskAdd = function() {
        $rootScope.task_list = null;
        $scope.blocked_value = "false";
        $mdSidenav('task').toggle();
            };
    
    $scope.closeTask = function(){
      $mdSidenav('task').close();
      document.getElementById('myTask').reset();
    }
    
    $scope.closeTask1 = function(){
      $mdSidenav('update_task').close();
      document.getElementById('myTask').reset()
    }
    
    $scope.newProject = function() {
               $mdSidenav('project').toggle();
            };
    
    $scope.closeProject = function(){
      $mdSidenav('project').close();
      document.getElementById('myProject').reset();
    }

    $scope.closeUpdateSlieder = function(){
      $mdSidenav('updateProject').close();
      document.getElementById('update_form_id').reset();
    }
    
    
    
});

/*global angular, app*/
app.controller('manage_quizesControllerExtension', function($scope, $controller, $rootScope, $http, $location, $mdDialog, H, M) {
    
     $scope.removeListHeaders = function(){
		return ['is_deleted'];
    }
    $rootScope.hideButton = false;
    var urlquestionSets = H.SETTINGS.baseUrl + '/question_sets';
    	$http.get(urlquestionSets)
        	.then(function(r){
            	$scope.questionSetsdata = r.data;
        	},function(e){
        		if(e && e.data && e.data.error && e.data.error.status){
        			newItem.error = e.data.error.message ? e.data.error.message : e.data.error.status;    
        		}
        	});
    
    var urlusers = H.SETTINGS.baseUrl + '/users';
    	$http.get(urlusers)
        	.then(function(r){
            	$scope.usersdata = r.data;
        	},function(e){
        		if(e && e.data && e.data.error && e.data.error.status){
        			newItem.error = e.data.error.message ? e.data.error.message : e.data.error.status;    
        		}
        	});
       
    
       $scope.newdate = function(Date){
       		$scope.data.single.date = H.toMySQLDateTime(Date);
    	};
});/*global angular, app*/
app.controller('modulesControllerExtension', function($scope, $controller, $rootScope, $http, $location, $mdDialog, H, M) {
    
     $scope.removeListHeaders = function(){
		return ['is_deleted'];
    }
         $rootScope.hideButton = false;

});/*global angular, app*/
app.controller('organizationsControllerExtension', function($scope, $controller, $rootScope, $http, $location, $timeout, $mdDialog, H, M) {

    if(!(['superadmin'].indexOf($rootScope.currentUser.role) > -1)){
        $location.path('unauthorized');
    }
         $rootScope.hideButton = false;
    $scope.checkLicenceValidity = function(item){return H.checkLicenseValidity(item) == 'valid' ? true : false };

    $scope.onInit = function(){
        //$scope.newSingle(function(){
            $scope.data.single.org_secret = H.getUUID();  
            $scope.data.single.license = 'basic';
            $scope.data.single.validity = '0001-01-01 00:00:00';
        //})
    };
    
    $scope.onLoadAll = function(){
        $scope.setListHeaders(['Organization', 'Email', 'License', 'Validity', 'Client Secret', 'Actions']);
    }
    
    $scope.currentOrganization = {};
    $scope.newOrganizationValues = {};
    $scope.newUserValues = {};
    
    $scope.activate = function(item, newItem) {
        if($rootScope.currentUser.role == 'superadmin'){
            //$scope.loading = true;
            var url = H.SETTINGS.baseUrl + '/organizations/activate';
            item.validity = (newItem.validity) ? H.toMySQLDateTime(newItem.validity) : item.validity;
            item.license = (newItem.license) ? newItem.license : item.license;
            $http.post(url, item)
                .then(function(r){
                    $scope.refreshData();
                    $scope.newOrganizationValues = {};
                    $scope.currentOrganization = {};
                    $mdDialog.cancel();   
                    //$scope.loading = false;
                },function(e){
                    if(e && e.data && e.data.error && e.data.error.message){
                        if(e.data.error.code == 404){
                            $scope.newOrganizationValues.error =  M.SAAS_API_UNAVAILABLE;
                        } else {
                            $scope.newOrganizationValues.error = e.data.error.message;
                        }
                    }
                    //$scope.newOrganizationValues = {};
                    //$scope.currentOrganization = {};
                    //$mdDialog.cancel();   
                    //$scope.loading = false;
                });
        }
    };
    
    $scope.setPassword = function(item, newItem) {
        if($rootScope.currentUser.role == 'superadmin'){
            if(newItem.admin_password == null || newItem.admin_password == ""){
                newItem.error = "Super Admin Password is required!";
                return;
            }
            if(newItem.password == null || newItem.password == ""){
                newItem.error = "Password is required!";
                return;
            }
            if(newItem.password != newItem.confirm_password){
                newItem.error = "Password and Confirm Password should match!";
                return;
            }
            var url = H.SETTINGS.baseUrl + '/users/set-password';
            newItem.admin_email = $rootScope.currentUser.email;
            newItem.secret = item.secret;
            newItem.email = item.email;
            //$scope.loading = true;
            $http.post(url, newItem)
                .then(function(r){
                    $scope.currentOrganization = {};
                    $scope.newUserValues = {};
                    $mdDialog.cancel();   
                    //$scope.loading = false;
                },function(e){
                    if(e && e.data && e.data.error && e.data.error.status){
                        newItem.error = e.data.error.message ? e.data.error.message : e.data.error.status;    
                    }
                    //$scope.loading = false;
                    //$scope.currentOrganization = {};
                    //$scope.newUserValues = {};
                    //$mdDialog.cancel();   
                });
        }
    };  
    
    $scope.showActivationDialog = function(ev, item) {
        $scope.currentOrganization = item;
        $mdDialog.show({
          contentElement: '#activationDialog',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: false
        });
    };
    
    $scope.hideActivationDialog = function(){
        $scope.newOrganizationValues = {};
        $scope.currentOrganization = {};
        
        $mdDialog.cancel();            
    };

    $scope.showSetPasswordDialog = function(ev, item) {
        $scope.currentOrganization = item;
        $mdDialog.show({
          contentElement: '#setPasswordDialog',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: false
        });
    };
    
    $scope.hideSetPasswordDialog = function(){
        $scope.currentOrganization = {};
        $scope.newUserValues = {};
        
        $mdDialog.cancel();            
    };
});/*global angular, app*/
app.controller('profilesControllerExtension', function($scope, $controller, $rootScope, $http, $location, $mdDialog, H, M) {
    
    $scope.removeListHeaders = function(){
    	return ['users','companies','employee_number','display_name','join_date','leave_date','birth_date','emergency_number',
    	'secondary_email','address','password','state','country','zipCode','city','is_primary','profile_picture','status','is_deleted']
	}
         $rootScope.hideButton = false;
    var urlCompany = H.SETTINGS.baseUrl + '/companies';
    	$http.get(urlCompany)
        	.then(function(r){
            	$scope.Companydata = r.data;
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
    
    var urlRole = H.SETTINGS.baseUrl + '/roles';
    	$http.get(urlRole)
        	.then(function(r){
            	$scope.Roledata = r.data;
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
    
       $scope.newjoinDate = function(Date){
       		$scope.data.single.joinDate = H.toMySQLDateTime(Date);
    	};
    	$scope.newleaveDate = function(Date){
       		$scope.data.single.leaveDate = H.toMySQLDateTime(Date);
    	};
    	$scope.newbirthDate = function(Date){
    		$scope.data.single.birthDate = H.toMySQLDateTime(Date);
    	};
});/*global angular, app*/
app.controller('projectsControllerExtension', function($scope, $controller, $rootScope, $http, $location, $mdDialog, H, M) {
    
    $scope.removeListHeaders = function(){
    	return ['is_deleted']
    }
    
    // var urlCompany = H.SETTINGS.baseUrl + '/companies';
    // 	$http.get(urlCompany)
    //     	.then(function(r){
    //         	$scope.companyname = r.data;
    //     	},function(e){
    //     		if(e && e.data && e.data.error && e.data.error.status){
    //     			newItem.error = e.data.error.message ? e.data.error.message : e.data.error.status;    
    //     		}
    //     	});
    
     $rootScope.hideButton = false;
    var urlClient = H.SETTINGS.baseUrl + '/clients';
    	$http.get(urlClient)
        	.then(function(r){
            	$scope.Clientdata = r.data;
        	},function(e){
        		if(e && e.data && e.data.error && e.data.error.status){
        			newItem.error = e.data.error.message ? e.data.error.message : e.data.error.status;    
        		}
        	});
       
    
       $scope.newestimatedStartDate = function(Date){
       		$scope.data.single.estimated_start_date = H.toMySQLDateTime(Date);
    	};
    	$scope.newestimatedEndDate = function(Date){
       		$scope.data.single.estimated_end_date = H.toMySQLDateTime(Date);
    	};
});/*global angular, app*/
app.controller('question_banksControllerExtension', function($scope, $controller, $rootScope, $http, $location, $mdDialog, H, M) {
    
    $scope.removeListHeaders = function(){
    	return ['is_deleted']
    }
         $rootScope.hideButton = false;
    var urlManageCourse = H.SETTINGS.baseUrl + '/manage_courses';
    	$http.get(urlManageCourse)
        	.then(function(r){
            	$scope.ManageCoursedata = r.data;
        	},function(e){
        		if(e && e.data && e.data.error && e.data.error.status){
        			newItem.error = e.data.error.message ? e.data.error.message : e.data.error.status;    
        		}
        	});
});/*global angular, app*/
app.controller('question_setsControllerExtension', function($scope, $controller, $rootScope, $http, $location, $mdDialog, H, M) {
    
    $scope.removeListHeaders = function(){
    	return ['is_deleted']
    }
         $rootScope.hideButton = false;

});/*global angular, app*/
app.controller('releasesControllerExtension', function($scope, $controller, $rootScope, $http, $location, $mdDialog, H, M) {
    
    $scope.removeListHeaders = function(){
    	return ['is_deleted']
    }
    
         $rootScope.hideButton = false;

     var projectsurl = H.SETTINGS.baseUrl + '/projects';
    	$http.get(projectsurl)
        	.then(function(r){
            	$scope.projectsdata = r.data;
        	},function(e){
        		if(e && e.data && e.data.error && e.data.error.status){
        			newItem.error = e.data.error.message ? e.data.error.message : e.data.error.status;    
        		}
        	});
    
    
       $scope.newDate = function(Date){
       		$scope.data.single.release_date = H.toMySQLDateTime(Date);
    	};
});/*global angular, app*/
app.controller('schedule_quizesControllerExtension', function($scope, $controller, $rootScope, $http, $location, $mdDialog, H, M) {
    
    $scope.removeListHeaders = function(){
    	return ['is_deleted']
    }
         $rootScope.hideButton = false;
    var urlquestionSets = H.SETTINGS.baseUrl + '/question_sets';
    	$http.get(urlquestionSets)
        	.then(function(r){
            	$scope.questionSetsdata = r.data;
        	},function(e){
        		if(e && e.data && e.data.error && e.data.error.status){
        			newItem.error = e.data.error.message ? e.data.error.message : e.data.error.status;    
        		}
        	});
    
    var urlusers = H.SETTINGS.baseUrl + '/users';
    	$http.get(urlusers)
        	.then(function(r){
            	$scope.usersdata = r.data;
        	},function(e){
        		if(e && e.data && e.data.error && e.data.error.status){
        			newItem.error = e.data.error.message ? e.data.error.message : e.data.error.status;    
        		}
        	});
       
    
       $scope.newdate = function(Date){
       		$scope.data.single.date = H.toMySQLDateTime(Date);
    	};
});/*global app*/
app.controller('settingsController', function($scope, $rootScope, $http, $cookies, H, M){
	$scope.H = H;
	$scope.M = H.M;
	
	$scope.locked = true;
	
	$scope.unlock = function(){
	    $scope.locked = false;
	};

	$scope.lock = function(){
	    $scope.locked = true;
	};

	$scope.forms = {};
	
	$scope.data = {
	    single: $rootScope.currentUser.organization
	};

});/*global app*/
//The name of the controller should be plural that matches with your API, ending with ControllerExtension. 
//Example: your API is http://localhost:8080/api/tasks then the name of the controller is tasksControllerExtension.
//To register this controller, just go to app/config/routes.js and add 'tasks' in 'easyRoutes' array.
app.controller('tasksControllerExtension', function($scope, $controller, $rootScope, $http, $location, $mdDialog, H, M, R) {
	     $rootScope.hideButton = false;

	$scope.removeListHeaders = function(){
    	return ['is_deleted']
    }

    //This function is called when you need to make changes to the new single object.
    $scope.onInit = function(obj){
        //$scope.data.single is available here. 'obj' refers to the same. It is the new instance of your 'tasks' resource that matches the structure of your 'tasks' API.
    };
    
    //This function is called when you are in edit mode. i.e. after a call has returned from one of your API that returns a single object. e.g http://localhost:8080/api/tasks/1
    $scope.onLoad = function(obj){
        //$scope.data.single is available here. 'obj' refers to the same. It represents the object you are trying to edit.
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
        next();
    };

    //This function is called after the create (POST) request is returned from API
    $scope.onSave = function (obj, next){
        //You can choose not to call next(), thus preventing the page to display the popup that confirms the object has been created.
        next();
    };
    
    //This function is called before the update (PUT) request goes to API
    $scope.beforeUpdate = function(obj, next){
        //You can choose not to call next(), thus rejecting the update request. This can be used for extra validations.
        next();
    };

    //This function is called after the update (PUT) request is returned from API
    $scope.onUpdate = function (obj, next){
        //You can choose not to call next(), thus preventing the page to display the popup that confirms the object has been updated.
        next();
    };
    
    //This function will be called whenever there is an error during save/update operations.
    $scope.onError = function (obj, next){
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


});/*global angular, app*/
app.controller('test_casesControllerExtension', function($scope, $controller, $rootScope, $http, $location, $mdDialog, H, M) {
    
    $scope.removeListHeaders = function(){
    	return ['is_deleted']
    }
         $rootScope.hideButton = false;
    var urlUserStories = H.SETTINGS.baseUrl + '/user_stories';
    	$http.get(urlUserStories)
        	.then(function(r){
            	$scope.UserStoriesdata = r.data;
        	},function(e){
        		if(e && e.data && e.data.error && e.data.error.status){
        			newItem.error = e.data.error.message ? e.data.error.message : e.data.error.status;    
        		}
        	});
    
    var urlTestStatus = H.SETTINGS.baseUrl + '/test_status';
    	$http.get(urlTestStatus)
        	.then(function(r){
            	$scope.TestStatusdata = r.data;
        	},function(e){
        		if(e && e.data && e.data.error && e.data.error.status){
        			newItem.error = e.data.error.message ? e.data.error.message : e.data.error.status;    
        		}
        	});
    
       $scope.newcreationDate = function(Date){
       		$scope.data.single.creation_date = H.toMySQLDateTime(Date);
    	};
    	$scope.newexecutionDate = function(Date){
       		$scope.data.single.execution_date = H.toMySQLDateTime(Date);
    	};
});/*global angular, app*/
app.controller('test_executionsControllerExtension', function($scope, $controller, $rootScope, $http, $location, $mdDialog, H, M) {
    
    $scope.removeListHeaders = function(){
    	return ['is_deleted']
    }
         $rootScope.hideButton = false;
    var urlUserStories = H.SETTINGS.baseUrl + '/user_stories';
    	$http.get(urlUserStories)
        	.then(function(r){
            	$scope.UserStoriesdata = r.data;
        	},function(e){
        		if(e && e.data && e.data.error && e.data.error.status){
        			newItem.error = e.data.error.message ? e.data.error.message : e.data.error.status;    
        		}
        	});
    
    var urlTestStatus = H.SETTINGS.baseUrl + '/test_status';
    	$http.get(urlTestStatus)
        	.then(function(r){
            	$scope.TestStatusdata = r.data;
        	},function(e){
        		if(e && e.data && e.data.error && e.data.error.status){
        			newItem.error = e.data.error.message ? e.data.error.message : e.data.error.status;    
        		}
        	});
    
    var urlTestCases = H.SETTINGS.baseUrl + '/test_cases';
    	$http.get(urlTestCases)
        	.then(function(r){
            	$scope.TestCasesdata = r.data;
        	},function(e){
        		if(e && e.data && e.data.error && e.data.error.status){
        			newItem.error = e.data.error.message ? e.data.error.message : e.data.error.status;    
        		}
        	});
	
	var urlTestplan = H.SETTINGS.baseUrl + '/test_plans';
    	$http.get(urlTestplan)
        	.then(function(r){
            	$scope.Testplandata = r.data;
        	},function(e){
        		if(e && e.data && e.data.error && e.data.error.status){
        			newItem.error = e.data.error.message ? e.data.error.message : e.data.error.status;    
        		}
        	});
	
});/*global angular, app*/
app.controller('test_plansControllerExtension', function($scope, $controller, $rootScope, $http, $location, $mdDialog, H, M) {
    
    $scope.removeListHeaders = function(){
    	return ['is_deleted']
    }
         $rootScope.hideButton = false;
    var urlUserStories = H.SETTINGS.baseUrl + '/user_stories';
    	$http.get(urlUserStories)
        	.then(function(r){
            	$scope.UserStoriesdata = r.data;
        	},function(e){
        		if(e && e.data && e.data.error && e.data.error.status){
        			newItem.error = e.data.error.message ? e.data.error.message : e.data.error.status;    
        		}
        	});
    
    var urlTestStatus = H.SETTINGS.baseUrl + '/test_status';
    	$http.get(urlTestStatus)
        	.then(function(r){
            	$scope.TestStatusdata = r.data;
        	},function(e){
        		if(e && e.data && e.data.error && e.data.error.status){
        			newItem.error = e.data.error.message ? e.data.error.message : e.data.error.status;    
        		}
        	});
    
    var urlTestCases = H.SETTINGS.baseUrl + '/test_cases';
    	$http.get(urlTestCases)
        	.then(function(r){
            	$scope.TestCasesdata = r.data;
        	},function(e){
        		if(e && e.data && e.data.error && e.data.error.status){
        			newItem.error = e.data.error.message ? e.data.error.message : e.data.error.status;    
        		}
        	});
    
       $scope.newreleaseDate = function(Date){
       		$scope.data.single.release_date = H.toMySQLDateTime(Date);
    	};
});/*global angular, app*/
app.controller('usersControllerExtension', function($scope, $controller, $rootScope, $http, $location, $mdDialog, H, M) {
    
         $rootScope.hideButton = false;

    if(!(['admin', 'superadmin'].indexOf($rootScope.currentUser.role) > -1)){
        $location.path('unauthorized');
    }

    $scope.onInit = function(){
        //$scope.newSingle(function(){
        $scope.data.single.password = H.getHash('pRESTige');    
        //});
    };
    
    $scope.onLoadAll = function(){
        $scope.setListHeaders(['Username', 'Email', 'Last Lease', 'Role', 'Actions']);
    }
    
    $scope.setPassword = function(item, newItem) {
        if(['admin', 'superadmin'].indexOf($rootScope.currentUser.role) > -1){
            if(newItem.admin_password == null || newItem.admin_password == ""){
                newItem.error = M.ADMIN_PASSWORD_REQUIRED;
                return;
            }
            if(newItem.password == null || newItem.password == ""){
                newItem.error = M.PASSWORD_REQUIRED;
                return;
            }
            if(newItem.password != newItem.confirm_password){
                newItem.error = M.PASSWORD_NOT_MATCHING;
                return;
            }
            var url = H.SETTINGS.baseUrl + '/users/set-password';
            newItem.admin_email = $rootScope.currentUser.email;
            newItem.secret = item.secret;
            newItem.email = item.email;
            //$scope.loading = true;
            $http.post(url, newItem)
                .then(function(r){
                    $scope.clickedUser = {};
                    $scope.newUserValues = {};
                    $mdDialog.cancel();   
                    //$scope.loading = false;
                },function(e){
                    if(e && e.data && e.data.error && e.data.error.status){
                        newItem.error = e.data.error.message ? e.data.error.message : e.data.error.status;    
                    }
                    //$scope.loading = false;
                });
        }
    };

    $scope.showSetPasswordDialog = function(ev, item) {
        $scope.clickedUser = item;
        $scope.newUserValues = {};        
        $mdDialog.show({
          contentElement: '#setPasswordDialog',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: false
        });
    };
    
    $scope.hideSetPasswordDialog = function(){
        $scope.clickedUser = {};
        $scope.newUserValues = {};
        $mdDialog.cancel();            
    }; 
    
});