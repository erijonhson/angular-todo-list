(function () {
    'use strict';

    angular.module('app.todos.list', ['ngAnimate', 'app.todo', 'toastr'])

            .controller('TodosListController', TodosListController);

    TodosListController.$inject = ['$http', '$state', 'Todo', 'toastr'];

    function TodosListController($http, $state, Todo, toastr) {
        
        const ENDPOINT_TODO = 'https://task-manager-elife.herokuapp.com/api/v1/tasks/';
        var vm = this;
        vm.todos = [];

        (function() {
            console.log("Request tasks");
            allTodos();
        })();

        vm.getTodos = allTodos;

        function allTodos() {
            return $http.get(ENDPOINT_TODO)
                    .then(success)
                    .catch(error);

            function success(response) {
                const todos = response.data.tasks;
                todos.forEach(function(t) {
                    vm.todos.push(new Todo(t));
                });
            }

            function error(e) {
                var newMessage = e.errors ? e.errors : 'Erro ao buscar tarefa.';
                toastr.error(newMessage);
            }
        }

        vm.addTodo = function (todo) {
            const todoCtrl = new Todo(todo);
            todoCtrl.addTodo().then(function(data) {
                vm.todos.push(data);
            });
            $state.go("root.todos.list");
        }

        vm.updateTodo = function (todo) {
            const todoCtrl = new Todo(todo);
            todoCtrl.updateTodo().then(function(data) {
                vm.todos.forEach(function(item, i) { 
                    if (item.id == data.id) 
                        vm.todos[i] = data; 
                });
            });
            $state.go("root.todos.list");
        }

        vm.deleteTodo = function (todo) {
            const todoCtrl = new Todo(todo);
            todoCtrl.deleteTodo().then(function(data) {
                vm.todos = vm.todos.filter(function(item) {
                    return item.id !== data.id
                });
            });
            $state.go("root.todos.list");
        }

    }
})();
