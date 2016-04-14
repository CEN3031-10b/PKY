'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function () {
  // Init module configuration options
  var applicationModuleName = 'mean';
  var applicationModuleVendorDependencies = ['ngResource', 'ngAnimate', 'ngMessages', 'ui.router', 'ui.bootstrap', 'ui.utils', 'angularFileUpload', 'angular.filter'];

  // Add a new vertical module
  var registerModule = function (moduleName, dependencies) {
    // Create angular module
    angular.module(moduleName, dependencies || []);

    // Add the module to the AngularJS configuration file
    angular.module(applicationModuleName).requires.push(moduleName);
  };

  return {
    applicationModuleName: applicationModuleName,
    applicationModuleVendorDependencies: applicationModuleVendorDependencies,
    registerModule: registerModule
  };
})();

'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider', '$httpProvider',
  function ($locationProvider, $httpProvider) {
    $locationProvider.html5Mode(true).hashPrefix('!');

    $httpProvider.interceptors.push('authInterceptor');
  }
]);

angular.module(ApplicationConfiguration.applicationModuleName).run(["$rootScope", "$state", "Authentication", function ($rootScope, $state, Authentication) {

  // Check authentication before changing state
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
    if (toState.data && toState.data.roles && toState.data.roles.length > 0) {
      var allowed = false;
      toState.data.roles.forEach(function (role) {
        if ((role === 'guest') || (Authentication.user && Authentication.user.roles !== undefined && Authentication.user.roles.indexOf(role) !== -1)) {
          allowed = true;
          return true;
        }
      });

      if (!allowed) {
        event.preventDefault();
        if (Authentication.user !== undefined && typeof Authentication.user === 'object') {
          $state.go('forbidden');
        } else {
          $state.go('authentication.signin').then(function () {
            storePreviousState(toState, toParams);
          });
        }
      }
    }
  });

  // Record previous state
  $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
    storePreviousState(fromState, fromParams);
  });

  // Store previous state
  function storePreviousState(state, params) {
    // only store this state if it shouldn't be ignored 
    if (!state.data || !state.data.ignoreState) {
      $state.previous = {
        state: state,
        params: params,
        href: $state.href(state, params)
      };
    }
  }
}]);

//Then define the init function for starting up the application
angular.element(document).ready(function () {
  //Fixing facebook bug with redirect
  if (window.location.hash && window.location.hash === '#_=_') {
    if (window.history && history.pushState) {
      window.history.pushState('', document.title, window.location.pathname);
    } else {
      // Prevent scrolling by storing the page's current scroll offset
      var scroll = {
        top: document.body.scrollTop,
        left: document.body.scrollLeft
      };
      window.location.hash = '';
      // Restore the scroll offset, should be flicker free
      document.body.scrollTop = scroll.top;
      document.body.scrollLeft = scroll.left;
    }
  }

  //Then init the app
  angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});

'use strict';

// Use Application configuration module to register a new module
ApplicationConfiguration.registerModule('core');
ApplicationConfiguration.registerModule('core.admin', ['core']);
ApplicationConfiguration.registerModule('core.admin.routes', ['ui.router']);

(function (app) {
  'use strict';
  app.registerModule('exams-analysis',['trNgGrid']);
  app.registerModule('exams-analysis.services');
  app.registerModule('exams-analysis.routes', ['ui.router', 'exams-analysis.services']);
})(ApplicationConfiguration);

(function (app) {
  'use strict';
  
  app.registerModule('exams',['angular.filter']);
  app.registerModule('exams.services');
  app.registerModule('exams.routes', ['ui.router', 'exams.services']);
})(ApplicationConfiguration);

(function (app) {
  'use strict';
  
  app.registerModule('standards',['angular.filter','exams.services','trNgGrid']);
  app.registerModule('standards.services');
  app.registerModule('standards.routes', ['ui.router', 'exams.services','standards.services']);
})(ApplicationConfiguration);

(function (app) {
  'use strict';
  
  app.registerModule('exams-take',['angular.filter']);
  app.registerModule('exams-take.services');
  app.registerModule('exams-take.routes', ['ui.router', 'exams-take.services']);
})(ApplicationConfiguration);

(function (app) {
  'use strict';
  
  app.registerModule('info',['angular.filter']);
  app.registerModule('info.services');
  app.registerModule('info.routes', ['ui.router', 'info.services']);
})(ApplicationConfiguration);

'use strict';

// Use Application configuration module to register a new module
ApplicationConfiguration.registerModule('users', ['core']);
ApplicationConfiguration.registerModule('users.admin', ['core.admin']);
ApplicationConfiguration.registerModule('users.admin.routes', ['core.admin.routes']);

'use strict';

angular.module('core.admin').run(['Menus',
  function (Menus) {
    Menus.addMenuItem('topbar', {
      title: 'Admin',
      state: 'admin',
      type: 'dropdown',
	  position: 5,
      roles: ['admin']
    });
  }
]);

'use strict';

// Setting up route
angular.module('core.admin.routes').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('admin', {
        abstract: true,
        url: '/admin',
        template: '<ui-view/>',
        data: {
          roles: ['admin']
        }
      });
  }
]);

(function () {
  'use strict';

  angular
  .module('core')
  .run(MenuConfig);

  MenuConfig.$inject = ['Menus'];

  function MenuConfig(Menus) {

    Menus.addMenu('account', {
      roles: ['user']
    });

    Menus.addMenuItem('account', {
      title: '',
      state: 'settings',
      type: 'dropdown',
      roles: ['user']
    });

    Menus.addSubMenuItem('account', 'settings', {
      title: 'Edit Profile',
      state: 'settings.profile'
    });

    Menus.addSubMenuItem('account', 'settings', {
      title: 'Edit Profile Picture',
      state: 'settings.picture'
    });

    Menus.addSubMenuItem('account', 'settings', {
      title: 'Change Password',
      state: 'settings.password'
    });

    Menus.addSubMenuItem('account', 'settings', {
      title: 'Manage Social Accounts',
      state: 'settings.accounts'
    });

  }

})();

'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {

    // Redirect to 404 when route not found
    $urlRouterProvider.otherwise(function ($injector, $location) {
      $injector.get('$state').transitionTo('not-found', null, {
        location: false
      });
    });

    // Home state routing
    $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'modules/core/client/views/home.client.view.html'
    })
    .state('not-found', {
      url: '/not-found',
      templateUrl: 'modules/core/client/views/404.client.view.html',
      data: {
        ignoreState: true
      }
    })
    .state('bad-request', {
      url: '/bad-request',
      templateUrl: 'modules/core/client/views/400.client.view.html',
      data: {
        ignoreState: true
      }
    })
    .state('forbidden', {
      url: '/forbidden',
      templateUrl: 'modules/core/client/views/403.client.view.html',
      data: {
        ignoreState: true
      }
    });
  }
]);

'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$state', 'Authentication', 'Menus',
  function ($scope, $state, Authentication, Menus) {
    // Expose view variables
    $scope.$state = $state;
    $scope.authentication = Authentication;

    // Get the topbar menu
    $scope.menu = Menus.getMenu('topbar');

    // Get the account menu
    $scope.accountMenu = Menus.getMenu('account').items[0];

    // Toggle the menu items
    $scope.isCollapsed = false;
    $scope.toggleCollapsibleMenu = function () {
      $scope.isCollapsed = !$scope.isCollapsed;
    };

    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = false;
    });
  }
]);

'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication',
  function ($scope, Authentication) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
  }
]);

'use strict';

/**
 * Edits by Ryan Hutchison
 * Credit: https://github.com/paulyoder/angular-bootstrap-show-errors */

angular.module('core')
  .directive('showErrors', ['$timeout', '$interpolate', function ($timeout, $interpolate) {
    var linkFn = function (scope, el, attrs, formCtrl) {
      var inputEl, inputName, inputNgEl, options, showSuccess, toggleClasses,
        initCheck = false,
        showValidationMessages = false,
        blurred = false;

      options = scope.$eval(attrs.showErrors) || {};
      showSuccess = options.showSuccess || false;
      inputEl = el[0].querySelector('.form-control[name]') || el[0].querySelector('[name]');
      inputNgEl = angular.element(inputEl);
      inputName = $interpolate(inputNgEl.attr('name') || '')(scope);

      if (!inputName) {
        throw 'show-errors element has no child input elements with a \'name\' attribute class';
      }

      var reset = function () {
        return $timeout(function () {
          el.removeClass('has-error');
          el.removeClass('has-success');
          showValidationMessages = false;
        }, 0, false);
      };

      scope.$watch(function () {
        return formCtrl[inputName] && formCtrl[inputName].$invalid;
      }, function (invalid) {
        return toggleClasses(invalid);
      });

      scope.$on('show-errors-check-validity', function (event, name) {
        if (angular.isUndefined(name) || formCtrl.$name === name) {
          initCheck = true;
          showValidationMessages = true;

          return toggleClasses(formCtrl[inputName].$invalid);
        }
      });

      scope.$on('show-errors-reset', function (event, name) {
        if (angular.isUndefined(name) || formCtrl.$name === name) {
          return reset();
        }
      });

      toggleClasses = function (invalid) {
        el.toggleClass('has-error', showValidationMessages && invalid);
        if (showSuccess) {
          return el.toggleClass('has-success', showValidationMessages && !invalid);
        }
      };
    };

    return {
      restrict: 'A',
      require: '^form',
      compile: function (elem, attrs) {
        if (attrs.showErrors.indexOf('skipFormGroupCheck') === -1) {
          if (!(elem.hasClass('form-group') || elem.hasClass('input-group'))) {
            throw 'show-errors element does not have the \'form-group\' or \'input-group\' class';
          }
        }
        return linkFn;
      }
    };
  }]);

'use strict';

angular.module('core').factory('authInterceptor', ['$q', '$injector', 'Authentication',
  function ($q, $injector, Authentication) {
    return {
      responseError: function(rejection) {
        if (!rejection.config.ignoreAuthModule) {
          switch (rejection.status) {
            case 401:
              // Deauthenticate the global user
              Authentication.user = null;
              $injector.get('$state').transitionTo('authentication.signin');
              break;
            case 403:
              $injector.get('$state').transitionTo('forbidden');
              break;
          }
        }
        // otherwise, default behaviour
        return $q.reject(rejection);
      }
    };
  }
]);

'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [
  function () {
    // Define a set of default roles
    this.defaultRoles = ['user', 'admin'];

    // Define the menus object
    this.menus = {};

    // A private function for rendering decision
    var shouldRender = function (user) {
      if (!!~this.roles.indexOf('*')) {
        return true;
      } else {
        if(!user) {
          return false;
        }
        for (var userRoleIndex in user.roles) {
          for (var roleIndex in this.roles) {
            if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
              return true;
            }
          }
        }
      }

      return false;
    };

    // Validate menu existance
    this.validateMenuExistance = function (menuId) {
      if (menuId && menuId.length) {
        if (this.menus[menuId]) {
          return true;
        } else {
          throw new Error('Menu does not exist');
        }
      } else {
        throw new Error('MenuId was not provided');
      }

      return false;
    };

    // Get the menu object by menu id
    this.getMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Return the menu object
      return this.menus[menuId];
    };

    // Add new menu object by menu id
    this.addMenu = function (menuId, options) {
      options = options || {};

      // Create the new menu
      this.menus[menuId] = {
        roles: options.roles || this.defaultRoles,
        items: options.items || [],
        shouldRender: shouldRender
      };

      // Return the menu object
      return this.menus[menuId];
    };

    // Remove existing menu object by menu id
    this.removeMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Return the menu object
      delete this.menus[menuId];
    };

    // Add menu item object
    this.addMenuItem = function (menuId, options) {
      options = options || {};

      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Push new menu item
      this.menus[menuId].items.push({
        title: options.title || '',
        state: options.state || '',
        type: options.type || 'item',
        class: options.class,
        roles: ((options.roles === null || typeof options.roles === 'undefined') ? this.defaultRoles : options.roles),
        position: options.position || 0,
        items: [],
        shouldRender: shouldRender
      });

      // Add submenu items
      if (options.items) {
        for (var i in options.items) {
          this.addSubMenuItem(menuId, options.state, options.items[i]);
        }
      }

      // Return the menu object
      return this.menus[menuId];
    };

    // Add submenu item object
    this.addSubMenuItem = function (menuId, parentItemState, options) {
      options = options || {};

      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Search for menu item
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].state === parentItemState) {
          // Push new submenu item
          this.menus[menuId].items[itemIndex].items.push({
            title: options.title || '',
            state: options.state || '',
            roles: ((options.roles === null || typeof options.roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : options.roles),
            position: options.position || 0,
            shouldRender: shouldRender
          });
        }
      }

      // Return the menu object
      return this.menus[menuId];
    };

    // Remove existing menu object by menu id
    this.removeMenuItem = function (menuId, menuItemState) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].state === menuItemState) {
          this.menus[menuId].items.splice(itemIndex, 1);
        }
      }

      // Return the menu object
      return this.menus[menuId];
    };

    // Remove existing menu object by menu id
    this.removeSubMenuItem = function (menuId, submenuItemState) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
          if (this.menus[menuId].items[itemIndex].items[subitemIndex].state === submenuItemState) {
            this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
          }
        }
      }

      // Return the menu object
      return this.menus[menuId];
    };

    //Adding the topbar menu
    this.addMenu('topbar', {
      roles: ['*']
    });
  }
]);

'use strict';

// Create the Socket.io wrapper service
angular.module('core').service('Socket', ['Authentication', '$state', '$timeout',
  function (Authentication, $state, $timeout) {
    // Connect to Socket.io server
    this.connect = function () {
      // Connect only when authenticated
      if (Authentication.user) {
        this.socket = io();
      }
    };
    this.connect();

    // Wrap the Socket.io 'on' method
    this.on = function (eventName, callback) {
      if (this.socket) {
        this.socket.on(eventName, function (data) {
          $timeout(function () {
            callback(data);
          });
        });
      }
    };

    // Wrap the Socket.io 'emit' method
    this.emit = function (eventName, data) {
      if (this.socket) {
        this.socket.emit(eventName, data);
      }
    };

    // Wrap the Socket.io 'removeListener' method
    this.removeListener = function (eventName) {
      if (this.socket) {
        this.socket.removeListener(eventName);
      }
    };
  }
]);

(function () {
  'use strict';

  angular
    .module('exams-analysis')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Add the dropdown list item to admin
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'View Student Attempts',
      state: 'exams-analysis.admin',
	  roles: ['admin']
    });
  }
})();

(function () {
  'use strict';

  angular
    .module('exams-analysis.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider	
      .state('exams-analysis', {
		url: '/review/attempt',
		abstract: true,
		template: '<ui-view></ui-view>'
      })	
      .state('exams-analysis.single', {
		parent: 'exams-analysis',
		url: '/:aID',
        templateUrl: 'modules/exams-analysis/client/views/review-single-attempt.client.view.html',
		controller: 'ReviewAttemptController',
		resolve:{
			Attempt: ["ExamsAnalysisService", "$stateParams", function(ExamsAnalysisService, $stateParams){
				return ExamsAnalysisService.get_attempt($stateParams.aID);
			}]
		},
      })
	  .state('exams-analysis.admin', {
		parent: 'admin',
        templateUrl: 'modules/exams-analysis/client/views/admin-review-attempts.client.view.html',
		url: '/review/attempts',
		controller: 'AdminAttemptController',
		resolve:{
			AllAttempts: ["ExamsAnalysisService", function(ExamsAnalysisService){
				return ExamsAnalysisService.get_all_attempts();
			}]
		},
      });
  }

})();

(function () {
  'use strict';

  angular
    .module('exams-analysis')
    .controller('AdminAttemptController', AdminAttemptController);

  AdminAttemptController.$inject = ['$scope', '$rootScope', '$state', '$stateParams', 'Authentication', '$uibModal','ExamsAnalysisService', 'AllAttempts'];

  function AdminAttemptController($scope, $rootScope, $state, $stateParams, Authentication, $uibModal,ExamsAnalysisService, AllAttempts) {
		$scope.all_attempts = AllAttempts.data;
		
		$scope.delete_attempt = function(_attempt){
			ExamsAnalysisService.delete_attempt(_attempt._id)
			.then(function(response){
				$scope.all_attempts.splice($scope.all_attempts.indexOf(_attempt),1);
			}, function(error){
				$scope.error = error;
				console.log(error);
			});
		};
		
		$scope.review_attempt = function(_attempt){
			$state.go('exams-analysis.single', {'aID':_attempt._id});
		};
  }
  
})();

(function () {
  'use strict';

  angular
    .module('exams-analysis')
    .controller('ReviewAttemptController', ReviewAttemptController);

  ReviewAttemptController.$inject = ['$scope', '$rootScope', '$state', '$stateParams', 'Authentication', '$uibModal', 'Attempt'];

  function ReviewAttemptController($scope, $rootScope, $state, $stateParams, Authentication, $uibModal, Attempt) {
	$scope.attempt = Attempt.data;
	$scope.multiple_choice = 'multiple choice';
	$scope.multiple_select = 'multiple select';
	$scope.fill_in_the_blank = 'fill in the blank';

	// populate view with attempt answers
	$scope.set_answers = function(_attempt){
		for(var i = 0; i < _attempt.questions.length; ++i){
			for(var j = 0; j < _attempt.student_answers.length; ++j){
				if(_attempt.student_answers[j].question_id === _attempt.questions[i].data._id){
					for(var k = 0; k < _attempt.questions[i].data.answers.length; ++k){
						if(_attempt.questions[i].data.answers[k]._id === _attempt.student_answers[j].answer_id){
							if(_attempt.questions[i].data.type === $scope.multiple_choice){
								_attempt.questions[i].selected_answer = _attempt.questions[i].data.answers[k]._id;
								_attempt.questions[i].data.answers[k].correct = _attempt.student_answers[j].correct;								
							}
							else if(_attempt.questions[i].data.type === $scope.multiple_select){
								_attempt.questions[i].data.answers[k].correct = _attempt.student_answers[j].correct;
							}
							else if(_attempt.questions[i].data.type === $scope.fill_in_the_blank){
								_attempt.questions[i].data.answers[k].value = _attempt.student_answers[j].value;
								_attempt.questions[i].data.answers[k].content = _attempt.student_answers[j].content;
							}
						}					
					}
				}
			}
		}
	};
	
	$scope.set_answers($scope.attempt);
  }
  
})();

(function () {
  'use strict';

  angular
    .module('exams-analysis.services')
    .factory('ExamsAnalysisService', ['$http', function($http){
		
      return {
		    get_attempt : function(attempt_id){
				return $http.get('/api/attempts/' + attempt_id);
			},
			create_attempt :function(exam_id){
				return $http.post('/api/attempts', {'exam_id':exam_id});
			},
			delete_attempt: function(attempt_id){
				return $http.delete('/api/attempts/' + attempt_id);
			},
			get_attempts : function(){
				return $http.get('/api/attempts');
			},
			// admins only, users will get bad request returned
			get_all_attempts : function(){
				return $http.get('/api/admin/attempts');
			},
			save_answers: function(attempt){
				return $http.put('/api/attempts/' + attempt._id, attempt);
			},
			submit_attempt: function(attempt){
				return $http.post('/api/attempts/' + attempt._id);
			}
      };

    }]);
})();

(function () {
  'use strict';

  angular
    .module('exams')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
	/*
    Menus.addMenuItem('topbar', {
      title: 'Exams',
      state: 'edit-exams',
      type: 'dropdown',
      roles: ['admin']
    });
	*/
	
    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Edit Exams',
      state: 'edit-exams',
	  roles: ['admin']
    });

  }
})();

(function () {
  'use strict';

  angular
    .module('exams.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('edit-exams', {
		parent: 'admin',
		url: '/exams/edit',
        templateUrl: 'modules/exams-crud/client/views/edit-exams.client.view.html',
		controller: 'EditExamsController',
		resolve:{
			exams: ["ExamsService", function(ExamsService){
				return ExamsService.get_exams();
			}]
		}
      })
      .state('edit-exams.single', {
		url:'/:exam_id',
		parent: 'edit-exams',
        templateUrl: 'modules/exams-crud/client/views/edit-single-exam.client.view.html',
        controller: 'EditSingleExamController',
		resolve:{
			exam: ["ExamsService", "$stateParams", function(ExamsService, $stateParams){
				if(!$stateParams.exam_id){
					return null;
				}
				return ExamsService.get_exam($stateParams.exam_id);
			}]
		}
      });
  }

})();

(function () {
  'use strict';

  angular
    .module('exams')
    .controller('AddExamController', AddExamController);

  AddExamController.$inject = ['$scope', '$rootScope', '$state', '$stateParams', 'ExamsService', 'Authentication', '$uibModalInstance','old_exam'];

  function AddExamController($scope, $rootScope, $state, $stateParams, ExamsService, Authentication, $uibModalInstance, old_exam) {

    $scope.exam = {};
	$scope.alert = null;
	$scope.old_exam = old_exam;
	$scope.loading = false;
	
	// edit mode
	if(old_exam){
		$scope.exam = JSON.parse(JSON.stringify(old_exam));
	}
	
	// TODO: info endpoint
    $scope.classes = ['Algebra 1', 'Algebra 2'];
	
	$scope.submit = function(){
		$scope.loading = true;
		if(old_exam){
			ExamsService.update_exam($scope.exam)
			.then(function(response){
				old_exam.title = response.data.title;
				old_exam.allotted_time = response.data.allotted_time;
				old_exam.allowed_attempts = response.data.allowed_attempts;
				old_exam.class =  response.data.class;
				$uibModalInstance.close(response.data);
				$scope.loading = false;
			}, function(error){
				$scope.loading = false;
				//TODO
			});
			
			return;
		}
	
		ExamsService.create_exam($scope.exam)
		.then(function(response){
			$uibModalInstance.close(response.data);
			$scope.loading = false;
		}, function(error){
			$scope.loading = false;
			//TODO
		});
	};
	
    $scope.ok = function () {
      $uibModalInstance.close();
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

    window.onpopstate = function(event) {
      $uibModalInstance.close();
    };
	
	$scope.$on('$locationChangeStart', function(event) {
		event.preventDefault();
		$uibModalInstance.dismiss('cancel');
	});
	
  }
  
})();

(function () {
  'use strict';

  angular
    .module('exams')
    .controller('AddQuestionController', AddQuestionController);

  AddQuestionController.$inject = ['$timeout','$scope','$rootScope','$state','$stateParams', 'ExamsService', 'Authentication', '$uibModalInstance', '$document', 'selected_exam','old_question','standards'];

  function AddQuestionController($timeout, $scope, $rootScope, $state, $stateParams, ExamsService, Authentication, $uibModalInstance, $document, selected_exam, old_question, standards) {
    
	// init
	$scope.standards = standards.data;
	console.log(standards.data);
	$scope.selected_exam = selected_exam;
	$scope.selected_type = null;
	$scope.old_question = null;
	$scope.alert = {};
	$scope.loading = false;	
	$scope.multiple_choice = 'multiple choice';
	$scope.multiple_select = 'multiple select';
	$scope.fill_in_the_blank = 'fill in the blank';

	// separate variables to save info if a question type is switched
	$scope.mc_question = {};
	$scope.mc_question.standards = [];
	$scope.mc_question.answers = [];
	$scope.mc_question.exam = selected_exam._id;
	$scope.mc_question.type = $scope.multiple_choice;
	
	$scope.ms_question = {};
	$scope.ms_question.standards = [];
	$scope.ms_question.answers = [];
	$scope.ms_question.exam = selected_exam._id;
	$scope.ms_question.type = $scope.multiple_select;
	
	$scope.fitb_question = {};
	$scope.fitb_question.standards = [];
	$scope.fitb_question.answers = [];
	$scope.fitb_question.exam = selected_exam._id;
	$scope.fitb_question.type = $scope.fill_in_the_blank;
	
	// edit mode if old_question is not null
	if(old_question){
		// copy to prevent question from changing beneath modal
		$scope.selected_type = old_question.type;
		$scope.old_question = old_question;
		$scope.question = JSON.parse(JSON.stringify(old_question));
	}
	
	$scope.set_type = function(_type){
		$scope.selected_type = _type;
		
		if(_type === $scope.multiple_choice){
			$scope.question = $scope.mc_question;
		}
		else if(_type === $scope.multiple_select){
			$scope.question = $scope.ms_question;
		}
		else if(_type === $scope.fill_in_the_blank){
			$scope.question = $scope.fitb_question;
		}
		
		$scope.init = true;
	};
  
	
    $scope.add_new_answer = function(_question){
		
		var answer = {
			content: '',
			correct: false,
			is_numeric: false,
			tolerance: 0,
			value: 0,
		};
		
		if(_question.answers != null)
		_question.answers.push(answer);
		
    };
	
	$scope.add_new_standard = function(_question){
		var standard = "";
		if(_question.standards != null)
		_question.standards.push(standard);
    };
		
	$scope.select_mc_answer = function(index){
		if($scope.question.type !== $scope.multiple_choice)
			return;
		
		// sets selected index to correct, all others false
		if($scope.question && $scope.question.answers){
			for(var i = 0; i < $scope.question.answers.length; ++i){
				$scope.question.answers[i].correct = (i==index);
			}
		}
	};
	  
    $scope.remove_answer = function(_question,_index){
		if(_question.answers)
		_question.answers.splice(_index, 1);  
    };
	
    $scope.submit = function(){
		$scope.loading = true;
		console.log($scope.question.standards);
		// if edit mode, update question
		if(old_question){
			ExamsService.update_question($scope.question)
			.then(function(response){
				$scope.loading = false;
				old_question.content = response.data.content;
				old_question.points = response.data.points;
				old_question.standards = response.data.standards;
				old_question.answers = response.data.answers;
				selected_exam.version++;
				$scope.ok();
			}, function(error){
				$scope.loading = false;
				if(error.data && error.data.message)
				$scope.set_alert(error.data.message);
				console.log(error);
			});
			
			return;
		}
		
		// add question, associate with test  
		ExamsService.create_question($scope.question)
		.then(function(response){
			selected_exam.questions.push(response.data);
			selected_exam.version++;
			$scope.ok();
		}, function(error){
			$scope.loading = false;
			if(error.data && error.data.message)
			$scope.set_alert(error.data.message);
		});
    };

	$scope.set_alert = function(msg){
		$scope.alert.message = msg;
		$scope.alert.show = true;
	}
	
	$scope.clear_alert = function(){
		$scope.alert.show = false;
	}
	
	$scope.ok = function () {
      $uibModalInstance.close();
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

	// prevent browser navigation underneath modal
	$scope.$on('$locationChangeStart', function(event) {
		event.preventDefault();
		$uibModalInstance.dismiss('cancel');
	});
	
  }
  
})();

(function () {
  'use strict';

  angular
    .module('exams')
    .controller('EditExamsController', EditExamsController);

  EditExamsController.$inject = ['$scope','$rootScope','$state','$stateParams', 'ExamsService', 'Authentication','$uibModal','$templateCache','exams'];

  function EditExamsController($scope, $rootScope, $state, $stateParams, ExamsService, Authentication, $uibModal, $templateCache, exams) {

	$scope.load = false;
  
	// init child state with no parameters
	$state.go('edit-exams.single');

	// get data from resolve
	$scope.exams = exams.data;
	for(var i = 0; i < $scope.exams.length; ++i){
		$scope.exams[i].active = false;
	}
	
	// init then find class type vars
	$scope.class_types = [];
	$scope.selected_class_type = null;
	
	// find unique class types
	for(var i = 0; i < $scope.exams.length; ++i){
		if($scope.class_types.indexOf($scope.exams[i].class) == -1){
			$scope.class_types.push($scope.exams[i].class);
		}
	}

	$scope.add_exam = function(){
		var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: '/modules/exams-crud/client/views/add-exam.client.view.html',
        controller: 'AddExamController',
        windowClass: 'add-question-modal',
        size: 'lg',
        resolve: {
		  old_exam: function(){
			return null;
		  }
        }
      });
	  
		modalInstance.result.then(
			// exam was added to db, returned as _exam
			function (_exam) {
			  if(_exam){
				$scope.exams.unshift(_exam);
			  }
		});
	  
	};
	
	if($scope.class_types){
		$scope.selected_class_type = $scope.class_types[0];
	}	
	
	$scope.set_tab = function(exam_id){
		for(var i = 0; i < $scope.exams.length; ++i){		
			$scope.exams[i].active = (exam_id === $scope.exams[i]._id);				
		}
	};
	
	// used to select tab
	$scope.activate_tab = function(_exam){
		for(var i = 0; i < $scope.exams.length; ++i){
			$scope.exams[i].active = false;
		}
		if(_exam){
			$scope.load = true;
			_exam.active = true;
			$state.go('edit-exams.single', {exam_id: _exam._id})
			.then(function(){
				$scope.load = false;
			});
		}
	};	
	
  }
  
})();

(function () {
  'use strict';

  angular
    .module('exams')
    .controller('EditSingleExamController', EditSingleExamController);

  EditSingleExamController.$inject = ['$scope','$rootScope','$state','$stateParams', 'ExamsService', 'Authentication', '$uibModal', 'exam'];

  function EditSingleExamController($scope,$rootScope, $state, $stateParams, ExamsService, Authentication, $uibModal, exam) {
	
	$scope.exam = null;
	$scope.load = false;
	$scope.loading = false;
	$scope.loading_question = false;
	
	$scope.calculate_points = function(_exam){
		_exam.point_total = 0;
		for(var i = 0; i <_exam.questions.length; ++i){
			if(_exam.questions[i].points != null){
				_exam.point_total += Number(_exam.questions[i].points);
			}
			else{
				_exam.point_total = 'One or more questions with undefined point value.';
				break;
			}
		}
	};
	
	if(exam){
		$scope.exam = exam.data;
		$scope.set_tab($scope.exam._id); // for reloading the page while editing an exam
		$scope.calculate_points($scope.exam);
	}

	$scope.delete_exam = function(_exam){
		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: '/modules/exams-crud/client/views/prompt-yes-no.client.view.html',
			controller: 'PromptController',
			windowClass: 'prompt-modal',
			size: 'lg',
			resolve: {
				question: function(){
					return null;
				},
				string_header: function(){
					return 'Are you sure you want to premanantly delete ' + _exam.title + '?';
				},
				old_exam: function(){
					return _exam;
				}
			}
		  });
		  
		modalInstance.result.then(
		function (yes) {
		  // question deletion confirmed
		  if(yes){
			$scope.loading = true;
			ExamsService.delete_exam(_exam._id)
			.then(function(response){
				$state.go('edit-exams', {}, {reload: true});
			}, function(error){
				$scope.loading = false;
			});
		  }
		});
	};
 
	$scope.delete_question = function(_exam, _question){
		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: '/modules/exams-crud/client/views/prompt-yes-no.client.view.html',
			controller: 'PromptController',
			windowClass: 'prompt-modal',
			size: 'lg',
			resolve: {
				question: function(){
					return _question;
				},
				string_header: function(){
					return 'Are you sure you want to premanantly delete this question?';
				},
				old_exam: function(){
					return null;
				}
			}
		});

	  modalInstance.result.then(
	  function (yes) {
		  // question deletion confirmed
		  if(yes){
			_question.loading = true;
			ExamsService.remove_question(_exam, _question._id)
			.then(function(response){
				
				// increment version (incremented on server during success response)
				_exam.version++;
				// remove question from array
				_exam.questions.splice(_exam.questions.indexOf(_question), 1);
				$scope.calculate_points(_exam);
			}, function(error){
				//TODO, display error
				_question.loading = false;
			});
		  }
	  });
	};

	$scope.edit_exam = function(_exam){
		var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: '/modules/exams-crud/client/views/add-exam.client.view.html',
        controller: 'AddExamController',
        windowClass: 'add-question-modal',
        size: 'lg',
        resolve: {
		  old_exam: function(){
			return _exam;
		  }
        }
        });
	  
		modalInstance.result.then(
		function (edited_exam) {
		  // question deletion confirmed
		  if(edited_exam){
			  for(var i = 0; i < $scope.exams.length; ++i){
				  if($scope.exams[i]._id === edited_exam._id){
					  $scope.exams[i] = edited_exam;
					  $scope.activate_tab($scope.exams[i]);
					  break;
				  }
			  }
		  }
		});
	};

	$scope.add_question_to_exam = function (_exam) {	
		var modalInstance = $uibModal.open({
		animation: true,
		templateUrl: '/modules/exams-crud/client/views/add-question.client.view.html',
		controller: 'AddQuestionController',
		windowClass: 'add-question-modal',
		size: 'lg',
		resolve: {
			selected_exam: function () {
					return _exam;
				},
			old_question: function(){
					return null;
				},
			standards: ["ExamsService", function(ExamsService){
				return ExamsService.get_standards();
			}]
		}
		});
	
		modalInstance.result.then(
		function(){
			$scope.calculate_points(_exam);
		});
	
    };
	
	$scope.edit_question = function(_exam, _question){
		var modalInstance = $uibModal.open({
		animation: true,
		templateUrl: '/modules/exams-crud/client/views/add-question.client.view.html',
		controller: 'AddQuestionController',
		windowClass: 'add-question-modal',
		size: 'lg',
		resolve: {
			selected_exam: function () {
				return _exam;
			},
			old_question: function(){
				return _question;
			},
			standards: ["ExamsService", function(ExamsService){
				return ExamsService.get_standards();
			}]
		}
		});
	  
		modalInstance.result.then(
		function(){
			$scope.calculate_points(_exam);
		});
	  
	};
	
  }
  
})();

(function () {
  'use strict';

  angular
    .module('exams')
    .controller('PromptController', PromptController);

  PromptController.$inject = ['$scope', '$rootScope', '$state', '$stateParams', 'ExamsService', 'Authentication', '$uibModalInstance','string_header'];

  function PromptController($scope, $rootScope, $state, $stateParams, ExamsService, Authentication, $uibModalInstance,string_header) {
    $scope.string_header = string_header;

	$scope.yes = function(){
		$uibModalInstance.close(true);
    };
  
    $scope.no = function () {
		$uibModalInstance.close();
    };

    $scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
    };
 
	$scope.$on('$locationChangeStart', function(event) {
		event.preventDefault();
		$uibModalInstance.dismiss('cancel');
	});
  
  }
  
})();

MathJax.Hub.Config({
    skipStartupTypeset: true,
	text2jax:{preview:"none"},
    messageStyle: "none",
    "HTML-CSS": {
        showMathMenu: false
    }
});
MathJax.Hub.Configured();

angular.module('exams').directive("mathjaxBind", function() {
    return {
        restrict: "A",
        scope:{
            text: "@mathjaxBind"
        },
        controller: ["$scope", "$element", "$attrs", function($scope, $element, $attrs) {
            
            $scope.$watch('text', function(value) {
                var $script = angular.element("<script type='math/tex'>")
                    .html(value == undefined ? "" : value);
                $element.html("");
                $element.append($script);
                MathJax.Hub.Queue(["Reprocess", MathJax.Hub, $element[0]],function(){

				});
            });
        }]
    };
});
angular.module('exams').directive('mathjax', ["$compile", function ($compile) {
  return {
    restrict: 'A',
    replace: true,
	link: function (scope, ele, attrs) {
		scope.$watch(attrs.mathjax, function(html) {
			if(!html){
				return;
			} 
			html = html.replace(/\$([^$]+)\$/g, "<span mathjax-bind=\"$1\"></span>");                
			ele.html(html);
			$compile(ele.contents())(scope);
		});
	}
  };
}]);

(function () {
  'use strict';

  angular
    .module('exams.services')
    .factory('ExamsService', ['$http', function($http){
		
      var exam_url_base = '/api/exams';
      var question_url_base = '/api/questions';
	  var standard_url_base = '/api/standards';
		
		// exams
      return {
        get_exams : function(questions,answers){
          return $http.get(exam_url_base +'/?questions=' + (questions === 1) + '&answers=' + (answers === 1));
        },
        get_exam : function(id){
          return $http.get(exam_url_base + '/' + id);
        },	
			
        update_exam : function(exam){
          return $http.put(exam_url_base + '/' + exam._id, exam);
        },
			
        create_exam : function(exam){
          return $http.post(exam_url_base, exam);
        },
			
        delete_exam : function(id){
          return $http.delete(exam_url_base + '/' + id);
        },
		remove_question: function(exam, question_id){
		  return $http.delete(exam_url_base +'/'+exam._id+'/questions/' + question_id);
		},
			
		// questions
        get_questions : function(){
          return $http.get(question_url_base);
        },
			
        get_question : function(id){
          return $http.get(question_url_base + '/' + id);
        },	
			
        update_question : function(question){
          return $http.put(question_url_base + '/' + question._id, question);
        },
			
        create_question : function(question){
          return $http.post(question_url_base, question);
        },
			
        delete_question : function(id){
          return $http.delete(question_url_base + '/' + id);
        },
		
		// standards
		get_standards : function(){
          return $http.get(standard_url_base);
        },
			
        get_standard : function(id){
          return $http.get(standard_url_base + '/' + id);
        },	
			
        update_standard : function(standard){
          return $http.put(standard_url_base + '/' + standard._id, standard);
        },
			
        create_standard : function(standard){
          return $http.post(standard_url_base, standard);
        },
			
        delete_standard : function(id){
          return $http.delete(standard_url_base + '/' + id);
        }
      };

    }]);
})();

(function () {
  'use strict';

  angular
    .module('standards')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Edit Standards',
      state: 'edit-standards',
	  roles: ['admin']
    });

  }
})();

(function () {
  'use strict';

  angular
    .module('standards.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('edit-standards', {
		parent: 'admin',
		url: '/standards/edit',
        templateUrl: 'modules/exams-standards/client/views/edit-standards.client.view.html',
		controller: 'EditStandardsController',
		resolve:{
			standards: ["ExamsService", function(ExamsService){
				return ExamsService.get_standards();
			}]
		}
      })
	  .state('view-standards', {
		parent: 'info',
		url: '/standards/view',
        templateUrl: 'modules/exams-standards/client/views/view-standards.client.view.html',
		controller: 'ViewStandardsController',
		resolve:{
			standards: ["ExamsService", function(ExamsService){
				return ExamsService.get_standards();
			}]
		}
      });
  }

})();

(function () {
  'use strict';

  angular
    .module('standards')
    .controller('AddStandardController', AddStandardController);

  AddStandardController.$inject = ['$timeout','$scope','$rootScope','$state','$stateParams', 'ExamsService', 'Authentication', '$uibModalInstance', '$document', 'old_standard', 'view'];

  function AddStandardController($timeout, $scope, $rootScope, $state, $stateParams, ExamsService, Authentication, $uibModalInstance, $document, old_standard, view) {
    
	$scope.standard = {};
	$scope.alert = {};
	$scope.view = view;
	if(old_standard){
		$scope.old_standard = old_standard;
		$scope.standard = JSON.parse(JSON.stringify(old_standard));
	}

    $scope.submit = function(){
		$scope.loading = true;
		
		if(old_standard){
			ExamsService.update_standard($scope.standard)
			.then(function(response){
				$scope.loading = false;
				old_standard.content = response.data.content;
				old_standard.code = response.data.code;
				old_standard.notes = response.data.notes;
				$scope.ok(old_standard);
			}, function(error){
				$scope.loading = false;
				if(error.data && error.data.message)
				$scope.set_alert(error.data.message);
				console.log(error);
			});
			
			return;
		}
		
		ExamsService.create_standard($scope.standard)
		.then(function(response){
			$scope.ok(response.data);
		}, function(error){
			$scope.loading = false;
			if(error.data && error.data.message)
			$scope.set_alert(error.data.message);
		});
    };

	$scope.set_alert = function(msg){
		$scope.alert.message = msg;
		$scope.alert.show = true;
	}
	
	$scope.clear_alert = function(){
		$scope.alert.show = false;
	}
	
	$scope.ok = function (data) {
      $uibModalInstance.close(data);
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

	// prevent browser navigation underneath modal
	$scope.$on('$locationChangeStart', function(event) {
		event.preventDefault();
		$uibModalInstance.dismiss('cancel');
	});
	
  }
  
})();

(function () {
  'use strict';

  angular
    .module('standards')
    .controller('EditStandardsController', EditStandardsController);

  EditStandardsController.$inject = ['$scope','$rootScope','$state','$stateParams', 'ExamsService', 'Authentication','$uibModal','standards'];

  function EditStandardsController($scope, $rootScope, $state, $stateParams, ExamsService, Authentication, $uibModal, standards) {
	$scope.standards = standards.data;
	$scope.loading = false;
	
	$scope.edit_standard = function(_standard){
		var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: '/modules/exams-standards/client/views/add-standard.client.view.html',
        controller: 'AddStandardController',
        windowClass: 'add-question-modal',
        size: 'lg',
        resolve: {
		  old_standard: function(){
			return _standard;
		  },
		  view: false
        }
        });
	  
		modalInstance.result.then(
		function (edited_standard) {
		  if(edited_standard){
			  for(var i = 0; i < $scope.standards.length; ++i){
				  if($scope.standards[i]._id === edited_standard._id){
					  $scope.standards[i] = edited_standard;
					  return;
				  }
			  }
			  
			  $scope.standards.push(edited_standard);
		  }
		});
	};
	
	$scope.delete_standard = function(_standard){
		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: '/modules/exams-crud/client/views/prompt-yes-no.client.view.html',
			controller: 'PromptController',
			windowClass: 'prompt-modal',
			size: 'lg',
			resolve: {
				string_header: function(){
					return 'Are you sure you want to permanantely delete this standard?';
				}
			}
		});

	  modalInstance.result.then(
	  function (yes) {
		  if(yes){
			$scope.loading = true;
			ExamsService.delete_standard(_standard._id)
			.then(function(response){
				$scope.loading = false;
				$scope.standards.splice($scope.standards.indexOf(_standard), 1);
			}, function(error){
				$scope.loading = false;
			});
		  }
	  });
	};
  }
  
})();

(function () {
  'use strict';

  angular
    .module('standards')
    .controller('ViewStandardsController', ViewStandardsController);

  ViewStandardsController.$inject = ['$scope','$rootScope','$state','$stateParams', 'ExamsService', 'Authentication','$uibModal','standards'];

  function ViewStandardsController($scope, $rootScope, $state, $stateParams, ExamsService, Authentication, $uibModal, standards) {
	$scope.standards = standards.data;
	$scope.loading = false;
	
	$scope.view_standard = function(_standard){
		var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: '/modules/exams-standards/client/views/add-standard.client.view.html',
        controller: 'AddStandardController',
        windowClass: 'add-question-modal',
        size: 'lg',
        resolve: {
		  old_standard: function(){
			return _standard;
		  },
		  view:true
        }
        });
	};
  }
  
})();

(function () {
  'use strict';

  angular
    .module('exams-take')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
	/*
    Menus.addMenuItem('topbar', {
      title: 'Practice Exams',
      state: 'exams-take',
	  type: 'dropdown',
      roles: ['user','admin']
    });
	
	Menus.addSubMenuItem('topbar', 'exams-take', {
      title: 'select exam',
      state: 'exams-take.select'
    });
	*/

  }
})();

(function () {
  'use strict';

  angular
    .module('exams-take.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('exams-take', {
		url: '/exams',
		abstract: true,
		template: '<ui-view></ui-view>'
      })		
      .state('exams-take.select', {
		parent: 'exams-take',
		url: '/select',
        templateUrl: 'modules/exams-take/client/views/select-exam.client.view.html',
		controller: 'SelectExamController',
		resolve:{
			exams: ["ExamsService", function(ExamsService){
				// returns exams without questions or answers populated
				return ExamsService.get_exams();
			}]
		}
      })
      .state('exams-take.take', {
		parent: 'exams-take',
		url:'/:eID',
        templateUrl: 'modules/exams-take/client/views/take-exam.client.view.html',
        controller: 'TakeExamController',
      });
  }

})();

(function () {
  'use strict';

  angular
    .module('exams-take')
    .controller('calculatorModal', calculatorModal);

  calculatorModal.$inject = ['$scope', '$rootScope', '$window','$state', '$stateParams', 'ExamsService','ExamsAnalysisService' ,'Authentication', '$uibModal', '$uibModalInstance'];

  function calculatorModal($scope, $rootScope, $window,$state, $stateParams, ExamsService,ExamsAnalysisService, Authentication, $uibModal, $uibModalInstance) {
	
	$scope.exitCalc = function () {
      $uibModalInstance.dismiss('exitCalc');
    };

}
  
})();

(function () {
  'use strict';

  angular
    .module('exams-take')
    .controller('SelectExamController', SelectExamController);

  SelectExamController.$inject = ['$scope', '$rootScope', '$state', '$stateParams', 'ExamsService', 'ExamsAnalysisService', 'Authentication', '$uibModal', 'exams'];

  function SelectExamController($scope, $rootScope, $state, $stateParams, ExamsService, ExamsAnalysisService, Authentication, $uibModal, exams) {

	$scope.exams = exams.data;
	$scope.attempts = [];
	$scope.error = null;
	
	ExamsAnalysisService.get_attempts()
	.then(function(response){
		$scope.attempts = response.data;
	}, function(error){
		$scope.error = error;
	});
	
	$scope.start_exam = function(_exam){
		$state.go('exams-take.take', {'eID':_exam._id});
	};
	$scope.review_attempt = function(_attempt){
		$state.go('exams-analysis.single', {'aID':_attempt._id});
	};
	
	$scope.delete_attempt = function(_attempt){
		ExamsAnalysisService.delete_attempt(_attempt._id)
		.then(function(response){
			$scope.attempts.splice($scope.attempts.indexOf(_attempt),1);
		}, function(error){
			$scope.error = error;
			console.log(error);
		});
	};
	
  }
  
})();

(function () {
  'use strict';

  angular
    .module('exams-take')
    .controller('TakeExamController', TakeExamController);

  TakeExamController.$inject = ['$scope', '$rootScope', '$window','$state', '$stateParams', 'ExamsService','ExamsAnalysisService' ,'Authentication', '$uibModal'];

  function TakeExamController($scope, $rootScope, $window,$state, $stateParams, ExamsService,ExamsAnalysisService, Authentication, $uibModal) {
	
	// init 
	$scope.attempt = {};	
	$scope.multiple_choice = 'multiple choice';
	$scope.multiple_select = 'multiple select';
	$scope.fill_in_the_blank = 'fill in the blank';
	$scope.loading = true;
	$scope.error = null;
	$scope.currentPage = 0; //Page numbering starts at 0-- view displays "currentPage+1" so that users see pages starting at page # 1
	$scope.indx = 0;
	

	//timer stuff
	$scope.percent_remaining = 0;
	$scope.time_remaining = $scope.attempt.exam_allotted_time;

	var timer = setInterval(function(){ 
		var currentDate = new Date().getTime();
		var startTime = Date.parse($scope.attempt.start_time);
		var endTime = $scope.attempt.exam_allotted_time;
		var timeElasped = Math.abs((currentDate - startTime))/60000;
		$scope.$apply(function(){
			$scope.time_remaining = endTime-Math.floor(timeElasped);
			$scope.percent_remaining = Math.abs($scope.time_remaining)/endTime*100;
		});
		if ($scope.percent_remaining>100 || $scope.time_remaining < 0) {
			$scope.submit_attempt();
			clearInterval(timer);
		}
	}, 1000);

    $scope.random = function() {
        return 0.5 - Math.random();
    }

	$scope.numberOfPages = function() {
			return $scope.attempt.questions.length;
		};

	// create a new attempt or return one in progress for the specified exam
	ExamsAnalysisService.create_attempt($stateParams.eID)
	.then(function(response){
		$scope.loading = false;
		$scope.attempt = response.data;
		$scope.set_answers($scope.attempt);
	}, function(error){
		$scope.loading = false;
		$scope.error = error;
	});
	
	$scope.save_attempt = function(){
		$scope.loading = true;
		ExamsAnalysisService.save_answers($scope.attempt)
		.then(function(response){
			$scope.loading = false;
			// TODO, check for differences
			//$scope.attempt = response.data;
			//$scope.set_answers($scope.attempt);
		}, function(error){
			$scope.loading = false;
			$scope.error = error;
		});
	};
	
	$scope.save_answer = function(_question,_answer){

		// filter previous answers, multiple choice should only have one answer per question
		// this will be validated on server side
		$scope.attempt.student_answers = $scope.attempt.student_answers.filter(function(sa){
			return sa.answer_id !== _answer._id && (_question.type !== $scope.multiple_choice || sa.question_id !== _question._id);
		});

		// add the selected answer
		$scope.attempt.student_answers.push({
			'question_id': _question._id,
			'answer_id': _answer._id,
			'is_numeric': _answer.is_numeric || false,
			'value': _answer.value,
			'content': _answer.content,
			'correct': _answer.correct,
		});
	
		$scope.save_attempt();
	};

	// populate view with previous answers
	$scope.set_answers = function(_attempt){
		for(var i = 0; i < _attempt.questions.length; ++i){
			for(var j = 0; j < _attempt.student_answers.length; ++j){
				if(_attempt.student_answers[j].question_id === _attempt.questions[i].data._id){
					for(var k = 0; k < _attempt.questions[i].data.answers.length; ++k){
						if(_attempt.questions[i].data.answers[k]._id === _attempt.student_answers[j].answer_id){
							if(_attempt.questions[i].data.type === $scope.multiple_choice){
								_attempt.questions[i].selected_answer = _attempt.questions[i].data.answers[k]._id;
								_attempt.questions[i].data.answers[k].correct = _attempt.student_answers[j].correct;								
							}
							else if(_attempt.questions[i].data.type === $scope.multiple_select){
								_attempt.questions[i].data.answers[k].correct = _attempt.student_answers[j].correct;
							}
							else if(_attempt.questions[i].data.type === $scope.fill_in_the_blank){
								_attempt.questions[i].data.answers[k].value = _attempt.student_answers[j].value;
								_attempt.questions[i].data.answers[k].content = _attempt.student_answers[j].content;
							}
						}					
					}
				}
			}
		}
	};
	
	$scope.submit_attempt = function(){
		clearInterval(timer);
		$scope.loading = true;
		ExamsAnalysisService.submit_attempt($scope.attempt)
		.then(function(response){
			$state.go('exams-take.select');
		}, function(error){
			$scope.loading = false;
			$scope.error = error;
		});
	};

	//navigate to previous question
	$scope.previousQuestion = function() {
		if($scope.indx <= 0){
			return;
		}	
		$scope.indx -= 1;
	};
		
	//navigate to previous question
	$scope.nextQuestion = function() {
		if($scope.indx >= $scope.attempt.questions.length - 1){
			return;
		}	
		$scope.indx += 1;
	};

	$scope.open_calculator = function(){
		  var modalInstance = $uibModal.open({
			windowClass: 'calc-modal',
			animation: false,
			templateUrl: '/modules/exams-take/client/views/calc-modal.client.view.html',
			backdrop: 'static',
    		keyboard: false,
    		controller: 'calculatorModal'
		  });	
	};
}
  
})();

(function () {
  'use strict';

  angular.module('exams-take')
    .directive('modaldraggable', modaldraggable);

  modaldraggable.$inject = ['$document'];

  function modaldraggable($document) {
	return function (scope, element) {
		var startX = 0,
		startY = 0,
		x = 0,
		y = 0;
		element= angular.element(document.getElementsByClassName("modal-dialog"));
		element.css({
			position: 'fixed',
			cursor: 'move'
		});

		element.on('mousedown', function (event) {
			// Prevent default dragging of selected content
			event.preventDefault();
			startX = event.screenX - x;
			startY = event.screenY - y;
			$document.on('mousemove', mousemove);
			$document.on('mouseup', mouseup);
		});

		function mousemove(event) {
			y = event.screenY - startY;
			x = event.screenX - startX;
			element.css({
			top: y + 'px',
			left: x + 'px'
		});
		}

		function mouseup() {
			$document.unbind('mousemove', mousemove);
			$document.unbind('mouseup', mouseup);
		}
	};
 }
}());
'use strict';

angular.module('exams-take').filter('startFrom', function() {
    return function(input, start) {
	    if (!input || !input.length) { return; }	// prevent slice from being called on undefined (i.e. we must have an input)
        start = +start; //parse to int
        return input.slice(start);
    };
}); 
(function () {
  'use strict';

  angular
    .module('info')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    Menus.addMenuItem('topbar', {
      title: 'Information',
      state: 'info',
      type: 'dropdown',
      roles: ['admin', 'user']
    });
	
    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'info', {
      title: 'Instructions',
      state: 'info.1'
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'info', {
      title: 'Accessing the Test',
      state: 'info.2'
    });

        // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'info', {
      title: 'Signing In',
      state: 'info.3'
    });

        // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'info', {
      title: 'Test Features',
      state: 'info.4'
    });

        // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'info', {
      title: 'Question Types',
      state: 'info.5'
    });
	
		
	Menus.addSubMenuItem('topbar', 'info', {
      title: 'EOC standards',
      state: 'view-standards'
    });
	
	

  }
})();

(function () {
  'use strict';

  angular
    .module('info.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('info', {
		  url: '/information',
      template: '<ui-view></ui-view>',
      abstract:true,
      })

      .state('info.1', {
      url:'/1',
      parent: 'info',
      templateUrl: 'modules/info/client/views/info1.client.view.html'
      })

      .state('info.2', {
      url:'/1',
      parent: 'info',
      templateUrl: 'modules/info/client/views/info2.client.view.html'
      })

      .state('info.3', {
      url:'/1',
      parent: 'info',
      templateUrl: 'modules/info/client/views/info3.client.view.html'
      })

      .state('info.4', {
      url:'/1',
      parent: 'info',
      templateUrl: 'modules/info/client/views/info4.client.view.html'
      })

      .state('info.5', {
      url:'/1',
      parent: 'info',
      templateUrl: 'modules/info/client/views/info5.client.view.html'
      });
  }

})();

'use strict';

// Configuring the Users module
angular.module('users.admin').run(['Menus',
  function (Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Users',
      state: 'admin.users'
    });
	
  }
  
]);

'use strict';

// Setting up route
angular.module('users.admin.routes').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('admin.users', {
        url: '/users',
        templateUrl: 'modules/users/client/views/admin/list-users.client.view.html',
        controller: 'UserListController'
      })
      .state('admin.user', {
        url: '/users/:userId',
        templateUrl: 'modules/users/client/views/admin/view-user.client.view.html',
        controller: 'UserController',
        resolve: {
          userResolve: ['$stateParams', 'Admin', function ($stateParams, Admin) {
            return Admin.get({
              userId: $stateParams.userId
            });
          }]
        }
      })
      .state('admin.user-edit', {
        url: '/users/:userId/edit',
        templateUrl: 'modules/users/client/views/admin/edit-user.client.view.html',
        controller: 'UserController',
        resolve: {
          userResolve: ['$stateParams', 'Admin', function ($stateParams, Admin) {
            return Admin.get({
              userId: $stateParams.userId
            });
          }]
        }
      });
  }
]);

'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
  function ($stateProvider) {
    // Users state routing
    $stateProvider
      .state('settings', {
        abstract: true,
        url: '/settings',
        templateUrl: 'modules/users/client/views/settings/settings.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('settings.profile', {
        url: '/profile',
        templateUrl: 'modules/users/client/views/settings/edit-profile.client.view.html'
      })
      .state('settings.password', {
        url: '/password',
        templateUrl: 'modules/users/client/views/settings/change-password.client.view.html'
      })
      // .state('settings.accounts', {
      //   url: '/accounts',
      //   templateUrl: 'modules/users/client/views/settings/manage-social-accounts.client.view.html'
      // })
      // .state('settings.picture', {
      //   url: '/picture',
      //   templateUrl: 'modules/users/client/views/settings/change-profile-picture.client.view.html'
      // })
      .state('authentication', {
        abstract: true,
        url: '/authentication',
        templateUrl: 'modules/users/client/views/authentication/authentication.client.view.html'
      })
      .state('authentication.signup', {
        url: '/signup',
        templateUrl: 'modules/users/client/views/authentication/signup.client.view.html'
      })
      .state('authentication.signin', {
        url: '/signin?err',
        templateUrl: 'modules/users/client/views/authentication/signin.client.view.html'
      })
      .state('password', {
        abstract: true,
        url: '/password',
        template: '<ui-view/>'
      })
      .state('password.forgot', {
        url: '/forgot',
        templateUrl: 'modules/users/client/views/password/forgot-password.client.view.html'
      })
      .state('password.reset', {
        abstract: true,
        url: '/reset',
        template: '<ui-view/>'
      })
      .state('password.reset.invalid', {
        url: '/invalid',
        templateUrl: 'modules/users/client/views/password/reset-password-invalid.client.view.html'
      })
      .state('password.reset.success', {
        url: '/success',
        templateUrl: 'modules/users/client/views/password/reset-password-success.client.view.html'
      })
      .state('password.reset.form', {
        url: '/:token',
        templateUrl: 'modules/users/client/views/password/reset-password.client.view.html'
      });
  }
]);

'use strict';

angular.module('users.admin').controller('UserListController', ['$scope', '$filter', 'Admin',
  function ($scope, $filter, Admin) {
    Admin.query(function (data) {
      $scope.users = data;
      $scope.buildPager();
    });

    $scope.buildPager = function () {
      $scope.pagedItems = [];
      $scope.itemsPerPage = 15;
      $scope.currentPage = 1;
      $scope.figureOutItemsToDisplay();
    };

    $scope.figureOutItemsToDisplay = function () {
      $scope.filteredItems = $filter('filter')($scope.users, {
        $: $scope.search
      });
      $scope.filterLength = $scope.filteredItems.length;
      var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
      var end = begin + $scope.itemsPerPage;
      $scope.pagedItems = $scope.filteredItems.slice(begin, end);
    };

    $scope.pageChanged = function () {
      $scope.figureOutItemsToDisplay();
    };
  }
]);

'use strict';

angular.module('users.admin').controller('UserController', ['$scope', '$state', 'Authentication', 'userResolve',
  function ($scope, $state, Authentication, userResolve) {
    $scope.authentication = Authentication;
    $scope.user = userResolve;

    $scope.remove = function (user) {
      if (confirm('Are you sure you want to delete this user?')) {
        if (user) {
          user.$remove();

          $scope.users.splice($scope.users.indexOf(user), 1);
        } else {
          $scope.user.$remove(function () {
            $state.go('admin.users');
          });
        }
      }
    };

    $scope.update = function (isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      var user = $scope.user;

      user.$update(function () {
        $state.go('admin.user', {
          userId: user._id
        });
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$state', '$http', '$location', '$window', 'Authentication', 'PasswordValidator',
  function ($scope, $state, $http, $location, $window, Authentication, PasswordValidator) {
    $scope.authentication = Authentication;
    $scope.popoverMsg = PasswordValidator.getPopoverMsg();

    // Get an eventual error defined in the URL query string:
    $scope.error = $location.search().err;

    // If user is signed in then redirect back home
    if ($scope.authentication.user) {
      $location.path('/');
    }

    $scope.signup = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      $http.post('/api/auth/signup', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;

        // And redirect to the previous or home page
        $state.go($state.previous.state.name || 'home', $state.previous.params);
      }).error(function (response) {
        $scope.error = response.message;
      });
    };

    $scope.signin = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      $http.post('/api/auth/signin', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;

        // And redirect to the previous or home page
        $state.go($state.previous.state.name || 'home', $state.previous.params);
      }).error(function (response) {
        $scope.error = response.message;
      });
    };

    // OAuth provider request
    $scope.callOauthProvider = function (url) {
      if ($state.previous && $state.previous.href) {
        url += '?redirect_to=' + encodeURIComponent($state.previous.href);
      }

      // Effectively call OAuth authentication route:
      $window.location.href = url;
    };
  }
]);

'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication', 'PasswordValidator',
  function ($scope, $stateParams, $http, $location, Authentication, PasswordValidator) {
    $scope.authentication = Authentication;
    $scope.popoverMsg = PasswordValidator.getPopoverMsg();

    // If user is signed in then redirect back home
    if ($scope.authentication.user) {
      $location.path('/');
    }

    // Submit forgotten password account id
    $scope.askForPasswordReset = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'forgotPasswordForm');

        return false;
      }

      $http.post('/api/auth/forgot', $scope.credentials).success(function (response) {
        // Show user success message and clear form
        $scope.credentials = null;
        $scope.success = response.message;

      }).error(function (response) {
        // Show user error message and clear form
        $scope.credentials = null;
        $scope.error = response.message;
      });
    };

    // Change user password
    $scope.resetUserPassword = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'resetPasswordForm');

        return false;
      }

      $http.post('/api/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.passwordDetails = null;

        // Attach user profile
        Authentication.user = response;

        // And redirect to the index page
        $location.path('/password/reset/success');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('ChangePasswordController', ['$scope', '$http', 'Authentication', 'PasswordValidator',
  function ($scope, $http, Authentication, PasswordValidator) {
    $scope.user = Authentication.user;
    $scope.popoverMsg = PasswordValidator.getPopoverMsg();

    // Change user password
    $scope.changeUserPassword = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'passwordForm');

        return false;
      }

      $http.post('/api/users/password', $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.$broadcast('show-errors-reset', 'passwordForm');
        $scope.success = true;
        $scope.passwordDetails = null;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('ChangeProfilePictureController', ['$scope', '$timeout', '$window', 'Authentication', 'FileUploader',
  function ($scope, $timeout, $window, Authentication, FileUploader) {
    $scope.user = Authentication.user;
    $scope.imageURL = $scope.user.profileImageURL;

    // Create file uploader instance
    $scope.uploader = new FileUploader({
      url: 'api/users/picture',
      alias: 'newProfilePicture'
    });

    // Set file uploader image filter
    $scope.uploader.filters.push({
      name: 'imageFilter',
      fn: function (item, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    });

    // Called after the user selected a new picture file
    $scope.uploader.onAfterAddingFile = function (fileItem) {
      if ($window.FileReader) {
        var fileReader = new FileReader();
        fileReader.readAsDataURL(fileItem._file);

        fileReader.onload = function (fileReaderEvent) {
          $timeout(function () {
            $scope.imageURL = fileReaderEvent.target.result;
          }, 0);
        };
      }
    };

    // Called after the user has successfully uploaded a new picture
    $scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
      // Show success message
      $scope.success = true;

      // Populate user object
      $scope.user = Authentication.user = response;

      // Clear upload buttons
      $scope.cancelUpload();
    };

    // Called after the user has failed to uploaded a new picture
    $scope.uploader.onErrorItem = function (fileItem, response, status, headers) {
      // Clear upload buttons
      $scope.cancelUpload();

      // Show error message
      $scope.error = response.message;
    };

    // Change user profile picture
    $scope.uploadProfilePicture = function () {
      // Clear messages
      $scope.success = $scope.error = null;

      // Start upload
      $scope.uploader.uploadAll();
    };

    // Cancel the upload process
    $scope.cancelUpload = function () {
      $scope.uploader.clearQueue();
      $scope.imageURL = $scope.user.profileImageURL;
    };
  }
]);

'use strict';

angular.module('users').controller('EditProfileController', ['$scope', '$http', '$location', 'Users', 'Authentication',
  function ($scope, $http, $location, Users, Authentication) {
    $scope.user = Authentication.user;

    // Update a user profile
    $scope.updateUserProfile = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      var user = new Users($scope.user);

      user.$update(function (response) {
        $scope.$broadcast('show-errors-reset', 'userForm');

        $scope.success = true;
        Authentication.user = response;
      }, function (response) {
        $scope.error = response.data.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('SocialAccountsController', ['$scope', '$http', 'Authentication',
  function ($scope, $http, Authentication) {
    $scope.user = Authentication.user;

    // Check if there are additional accounts
    $scope.hasConnectedAdditionalSocialAccounts = function (provider) {
      for (var i in $scope.user.additionalProvidersData) {
        return true;
      }

      return false;
    };

    // Check if provider is already in use with current user
    $scope.isConnectedSocialAccount = function (provider) {
      return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
    };

    // Remove a user social account
    $scope.removeUserSocialAccount = function (provider) {
      $scope.success = $scope.error = null;

      $http.delete('/api/users/accounts', {
        params: {
          provider: provider
        }
      }).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.user = Authentication.user = response;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('SettingsController', ['$scope', 'Authentication',
  function ($scope, Authentication) {
    $scope.user = Authentication.user;
  }
]);

'use strict';

angular.module('users')
  .directive('passwordValidator', ['PasswordValidator', function(PasswordValidator) {
    return {
      require: 'ngModel',
      link: function(scope, element, attrs, ngModel) {
        ngModel.$validators.requirements = function (password) {
          var status = true;
          if (password) {
            var result = PasswordValidator.getResult(password);
            var requirementsIdx = 0;

            // Requirements Meter - visual indicator for users
            var requirementsMeter = [
              { color: 'danger', progress: '20' },
              { color: 'warning', progress: '40' },
              { color: 'info', progress: '60' },
              { color: 'primary', progress: '80' },
              { color: 'success', progress: '100' }
            ];

            if (result.errors.length < requirementsMeter.length) {
              requirementsIdx = requirementsMeter.length - result.errors.length - 1;
            }

            scope.requirementsColor = requirementsMeter[requirementsIdx].color;
            scope.requirementsProgress = requirementsMeter[requirementsIdx].progress;

            if (result.errors.length) {
              scope.popoverMsg = PasswordValidator.getPopoverMsg();
              scope.passwordErrors = result.errors;
              status = false;
            } else {
              scope.popoverMsg = '';
              scope.passwordErrors = [];
              status = true;
            }
          }
          return status;
        };
      }
    };
  }]);

'use strict';

angular.module('users')
  .directive('passwordVerify', [function() {
    return {
      require: 'ngModel',
      scope: {
        passwordVerify: '='
      },
      link: function(scope, element, attrs, ngModel) {
        var status = true;
        scope.$watch(function() {
          var combined;
          if (scope.passwordVerify || ngModel) {
            combined = scope.passwordVerify + '_' + ngModel;
          }
          return combined;
        }, function(value) {
          if (value) {
            ngModel.$validators.passwordVerify = function (password) {
              var origin = scope.passwordVerify;
              return (origin !== password) ? false : true;
            };
          }
        });
      }
    };
  }]);

'use strict';

// Users directive used to force lowercase input
angular.module('users').directive('lowercase', function () {
  return {
    require: 'ngModel',
    link: function (scope, element, attrs, modelCtrl) {
      modelCtrl.$parsers.push(function (input) {
        return input ? input.toLowerCase() : '';
      });
      element.css('text-transform', 'lowercase');
    }
  };
});

'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', ['$window',
  function ($window) {
    var auth = {
      user: $window.user
    };

    return auth;
  }
]);

'use strict';

// PasswordValidator service used for testing the password strength
angular.module('users').factory('PasswordValidator', ['$window',
  function ($window) {
    var owaspPasswordStrengthTest = $window.owaspPasswordStrengthTest;

    return {
      getResult: function (password) {
        var result = owaspPasswordStrengthTest.test(password);
        return result;
      },
      getPopoverMsg: function () {
        var popoverMsg = 'Please enter a passphrase or password with greater than 10 characters, numbers, lowercase, upppercase, and special characters.';
        return popoverMsg;
      }
    };
  }
]);

'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
  function ($resource) {
    return $resource('api/users', {}, {
      update: {
        method: 'PUT'
      }
    });
  }
]);

//TODO this should be Users service
angular.module('users.admin').factory('Admin', ['$resource',
  function ($resource) {
    return $resource('api/users/:userId', {
      userId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
