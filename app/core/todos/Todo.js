(function () {
    'use strict';

    angular.module('app.todo', [])

            .factory('Todo', todo);

    todo.$inject = ['$q', '$http', 'API_URIS'];

    function todo($q, $http, API_URIS) {

        const Todo = function (data) {
            if (!!data) {
                this.todos = [];
                this.id = data.id;
                this.title = data.title;
                this.description = data.description;
                this.done = data.done;
                this.deadline = new Date(data.deadline);
            }
        }

        Todo.prototype.addOrUpdateTodo = function() {
            var temp = this;
            if (temp.id) {
                return temp.updateTodo();
            } else {
                return temp.addTodo();
            }
        }

        Todo.prototype.addTodo = function() {
            var temp = this;
            const todo = temp.getData();
            return $http.post(API_URIS.TODO, todo)
                    .then(success);

            function success(response) {
                const todo = new Todo(response.data);
                return { data: todo };
            }
        }

        Todo.prototype.updateTodo = function() {
            var temp = this;
            const todo = temp.getData();
            const uri = API_URIS.TODO + todo.id;
            return $http.put(uri, todo)
                    .then(success);

            function success(response) {
                const todo = new Todo(response.data);
                return { data: todo };
            }
        }

        Todo.prototype.updateTodoDone = function() {
            var temp = this;
            const incompleteTodo = { id: temp.id, done: temp.done };
            const uri = API_URIS.TODO + incompleteTodo.id;
            return $http.put(uri, incompleteTodo)
                    .then(success);

            function success(response) {
                const todo = new Todo(response.data);
                return { data: todo };
            }
        }

        Todo.prototype.deleteTodo = function() {
            var temp = this;
            const todoCopy = angular.copy(temp);
            const todo = temp.getData();
            const uri = API_URIS.TODO + todo.id;
            return $http.delete(uri).then(function success(response) {
                return { data: todoCopy };
            });
        }

        Todo.prototype.constructor = Todo;

        Todo.prototype.getData = function() {
            return {
                id: this.id,
                title: this.title,
                description: this.description,
                done: this.done,
                deadline: this.deadline
            };
        };

        return Todo;
    }
})();