(function () {
    'use strict';

    angular.module('app.todo', ['toastr'])

            .factory('Todo', todo);

    todo.$inject = ['$q', '$http', 'toastr', 'API_URIS'];

    function todo($q, $http, toastr, API_URIS) {

        const Todo = function (data) {
            if (!!data) {
                this.id = data.id;
                this.title = data.title;
                this.description = data.description;
                this.deadline = data.deadline;
            }
        }

        Todo.prototype.addTodo = function () {
            const todo = this.getData();
            return $http.post(API_URIS.TODO, todo)
                    .then(success)
                    .catch(error);

            function success(response) {
                const todo = new Todo(response.data);
                return { data: todo };
            }

            function error(e) {
                var message = e.errors ? e.errors : 'Erro ao adicionar a tarefa.';
                toastr.error(message);
            }
        }

        Todo.prototype.updateTodo = function () {
            const todo = this.getData();
            const uri = API_URIS.TODO + todo.id;
            return $http.put(uri, todo)
                    .then(success)
                    .catch(error);

            function success(response) {
                const todo = new Todo(response.data);
                return { data: todo };
            }

            function error(e) {
                var message = e.errors ? e.errors : 'Erro ao atualizar a tarefa.';
                toastr.error(message);
            }
        }

        Todo.prototype.deleteTodo = function () {
            const todoCopy = angular.copy(this);
            const todo = this.getData();
            const uri = API_URIS.TODO + todo.id;
            return $http.delete(uri)
                    .then(success)
                    .catch(error);

            function success(response) {
                return { data: todoCopy };
            }

            function error(e) {
                var message = e.errors ? e.errors : 'Erro ao deletar a tarefa.';
                toastr.error(message);
            }
        }

        Todo.prototype.constructor = Todo;

        Todo.prototype.getData = function () {
            return {
                id: this.id,
                title: this.title,
                description: this.description,
                deadline: this.deadline
            };
        };

        return Todo;
    }
})();