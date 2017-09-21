(function () {
    'use strict';

    angular.module('app')

            .config(interceptorConfig)
            .config(stateConfig);

    interceptorConfig.$inject = ['$provide', '$httpProvider'];
    function interceptorConfig($provide, $httpProvider) {

        function tokenInterceptor($q, $injector) {
            return {
                'request': function(config) {
                    config.headers = config.headers || {};
                    if (config.url.includes("/api/v1")) {
                        const loggedUser = localStorage.getItem('loggedUser');
                        if (loggedUser !== "null" && loggedUser !== null && loggedUser !== undefined) {
                            const user = JSON.parse(loggedUser);
                            config.headers.Authorization = user.token;
                        }
                    }
                    return config;
                },
                'responseError': function (rejection) {
                    if(rejection.status === 401) {
                        localStorage.setItem('loggedUser', null);
                        $injector.get('$state').go('root.signin');
                    }
                    return $q.reject(rejection);
                }
            }
        }

        $provide.factory('tokenInterceptor', ['$q', '$injector', tokenInterceptor]);

        $httpProvider.interceptors.push('tokenInterceptor');

    }

    stateConfig.$inject = ['$stateProvider', '$urlRouterProvider'];
    function stateConfig($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.when('', '/signin');
        $urlRouterProvider.when('/', '/signin');
        $urlRouterProvider.when('/todos', '/todos/list');
        $urlRouterProvider.when('/todos/', '/todos/list');
        $urlRouterProvider.otherwise('/');

        function checkLogin($state, sessionService, $q, toastr) {
            if (!sessionService.getLoggedUser()) {
                toastr.error('Faça login para continuar.');
                $state.go('root.signin');
                return $q.reject("Usuário não logado.");
            }
            return $q.when();
        }

        $stateProvider
                .state('root', {
                    abstract: true,
                    url: '/',
                    data: {
                        title: 'Home',
                        breadcrumb: 'Home'
                    },
                    views: {
                        'header': {
                            templateUrl: 'core/navigation/headerView.html',
                            controller: 'HeaderController',
                            controllerAs: 'HC'
                        },
                        'menu': {
                            templateUrl: 'core/navigation/menuView.html',
                            controller: 'MenuController',
                            controllerAs: 'MC'
                        },
                        'breadcrumbs': {
                            templateUrl: 'core/navigation/breadcrumbsView.html',
                            controller: 'BreadcrumbsController',
                            controllerAs: 'BC'
                        },
                        'content': {
                            template: 'Escolha um menu...'
                        },
                        'footer': {
                            templateUrl: 'core/navigation/footerView.html',
                            controller: 'FooterController',
                            controllerAs: 'FC'
                        }
                    }
                })
                .state('root.todos', {
                    abstract: true,
                    url: 'todos',
                    data: {
                        title: 'Todos',
                        breadcrumb: 'Todos'
                    },
                    params: {
                        todos: null
                    },
                    resolve: {
                        checkLogin: checkLogin
                    }
                })
                .state('root.todos.list', {
                    url: '/list',
                    data: {
                        title: 'To-do list',
                        breadcrumb: 'List'
                    },
                    params: {
                        todo: null
                    },
                    views: {
                        'content@': {
                            templateUrl: 'core/todos/listView.html',
                            controller: 'TodosListController',
                            controllerAs: 'TLC'
                        }
                    }
                })
                .state('root.todos.new', {
                    url: '/new',
                    data: {
                        title: 'New todo',
                        breadcrumb: 'New'
                    },
                    params: {
                        todo: null
                    },
                    views: {
                        'content@': {
                            templateUrl: 'core/todos/newView.html',
                            controller: 'TodosNewController',
                            controllerAs: 'TNC'
                        }
                    }
                })
                .state('root.signup', {
                    url: 'signup',
                    views: {
                        'content@': {
                            templateUrl: 'core/session/signupView.html',
                            controller: 'SessionController',
                            controllerAs: 'SC'
                        }
                    }
                })
                .state('root.signin', {
                    url: 'signin',
                    views: {
                        'content@': {
                            templateUrl: 'core/session/signinView.html',
                            controller: 'SessionController',
                            controllerAs: 'SC'
                        }
                    },
                    resolve: {
                        doSignin: function ($location, sessionService) {
                            if (sessionService.getLoggedUser()) {
                                // $state.go('root.todos.list');
                                $location.path('/todos/list');
                            }
                        }
                    }
                })
                .state('root.logout', {
                    url: 'logout',
                    data: {
                        title: 'Logout',
                        breadcrumb: 'Logout'
                    },
                    resolve: {
                        doLogout: function ($location, sessionService) {
                            if (sessionService.getLoggedUser()) {
                                sessionService.logout();
                            }
                            // $state.go('root.signin');
                            $location.path('/signin');
                        }
                    }
                });
    }

})();
