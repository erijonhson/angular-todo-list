(function () {
    'use strict';

    angular.module('app.user', ['app.todo'])

            .factory('User', user);

    user.$inject = ['Todo', '$q', '$http', 'API_URIS'];

    /**
     * Represents a User of the app.
     */
    function user(Todo, $q, $http, API_URIS) {

        const User = function(data) {
            if (!!data) {
                this.todos = [];
                this.id = data.id;
                this.name = data.name;
                this.email = data.email;
                this.token = data.auth_token;
            }
        }

        /**
         * Add ou update user's task.
         */
        User.prototype.addOrUpdateTodo = function(todo) {
            var temp = this;
            return todo.addOrUpdateTodo().then(function(data) {
                // update
                const aux = new Todo(data.data);
                var updated = false;
                for (var i in temp.todos) {
                    if (temp.todos[i].id == aux.id) {
                        temp.todos[i] = aux;
                        updated = true;
                        break;
                    }
                }

                // add
                if (!updated) {
                    temp.todos.push(aux);
                }

                return { data: aux };
            })
            .catch(function() {
                var message = e.errors ? e.errors : 
                    'Erro ao deletar tarefas de usuário. Favor atualize a página!';
                return $q.reject(message);
            });
        }

        /**
         * Delete user's task.
         */
        User.prototype.deleteTodo = function(todo) {
            var temp = this;
            const copy = angular.copy(todo);
            return todo.deleteTodo().then(function(data) {
                temp.todos = temp.todos.filter(function(item) {
                    return item.id != copy.id;
                });
                return { data: copy };
            }).catch(function() {
                var message = e.errors ? e.errors : 
                    'Erro ao deletar tarefas de usuário. Favor atualize a página!';
                return $q.reject(message);
            });
        }

        /**
         * Received all the tasks of the User.
         */
        User.prototype.loadTodos = function() {
            var temp = this;
            return $http.get(API_URIS.TODO)
                    .then(success)
                    .catch(error);

            function success(response) {
                temp.todos = [];
                response.data.tasks.forEach(function(t) {
                    temp.todos.push(new Todo(t));
                });
                return { data: temp.todos };
            }

            function error(e) {
                var message = e.errors ? e.errors : 
                    'Erro ao buscar tarefas de usuário. Favor atualize a página!';
                return $q.reject(message);
            }
        }

        User.prototype.constructor = User;

        User.prototype.getData = function() {
            return {
                name: this.name,
                email: this.email,
                password: this.password,
                token: this.token
            };
        };

        return User;
    }
})();