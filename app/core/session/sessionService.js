(function () {
    'use strict';

    angular.module('app.sessionService', ['app.user', 'app.todo', 'toastr'])

            .service('sessionService', sessionService);

    sessionService.$inject = ['User', 'Todo', '$http', '$state', 'toastr', 'API_URIS'];
    function sessionService(User, Todo, $http, $state, toastr, API_URIS) {
        var vm = this;
        let loggedUser;

        vm.login = function(user) {
            return $http.post(API_URIS.LOGIN, user).then(function(data) {
                loggedUser = new User(data.data);
                saveUserOnCache();
                var result = { data: loggedUser };
                return result;
            });
        };

        vm.signUp = function(user) {
            return $http.post(API_URIS.SIGNUP, user).then(function(data) {
                loggedUser = new User(data.data);
                var result = { data: loggedUser };
                return result;
            });
        };

        vm.getLoggedUser = function() {
            return loggedUser;
        };

        vm.logout = function() {
            loggedUser = null;
            removeUserFromCache();
        };

        vm.listAllTodos = function() {
            return $http.get(API_URIS.TODO)
                    .then(success)
                    .catch(error);

            function success(response) {
                var todos = [];
                response.data.tasks.forEach(function(t) {
                    todos.push(new Todo(t));
                });
                return { data: todos };
            }

            function error(e) {
                var message = e.errors ? e.errors : 
                    'Erro ao buscar tarefas de usuário. Favor atualize a página!';
                toastr.error(message);
                return { data: [] };
            }
        }

        function removeUserFromCache() {
            localStorage.setItem('loggedUser', null);
        }

        function saveUserOnCache() {
            localStorage.setItem('loggedUser', JSON.stringify(loggedUser));
        }

        function getUserFromCache() {
            const userStr = localStorage.getItem('loggedUser');
            if (!userStr) {
                return undefined;
            }
            return JSON.parse(userStr);
        }

        (function() {
            const cacheUser = getUserFromCache();
            if (cacheUser) {
                loggedUser = new User(cacheUser);
                vm.listAllTodos().then(function(data) {
                    $state.go('root.todos.list', { todos: data.data });
                });
            }
        })();
    }
})();