(function () {
    'use strict';

    angular.module('app.todos.list', ['ngAnimate', 'app.todo', 'toastr'])

            .controller('TodosListController', TodosListController);

    TodosListController.$inject = ['$http', '$stateParams', '$state', 'Todo', 'toastr'];

    function TodosListController($http, $stateParams, $state, Todo, toastr) {
        
        const ENDPOINT_TODO = 'https://task-manager-elife.herokuapp.com/api/v1/tasks/';
        //const ENDPOINT_TODO = 'http://0.0.0.0:3000/api/v1/tasks/';
        
        var vm = this;
        vm.todo = {};
        vm.todos = [];

        (function() {
            console.log("Request tasks");
            allTodos();
            checkParameters();
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

        vm.updateTodo = function () {
            const todoCtrl = new Todo(vm.todo);
            todoCtrl.updateTodo().then(function(data) {
                for (var i in vm.todos) {
                    if (vm.todos[i].id == data.id) {
                        vm.todos[i] = data;
                        break;
                    }
                }
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

        vm.resolve = function (todo) {
            if (todo.id == null || todo.id == undefined || todo.id == '') {
                return this.addTodo(todo);
            } else {
                return this.updateTodo(todo);
            }
        }

        function checkParameters() {
            if ($stateParams.obj != null) {
                vm.todo = $stateParams.obj;
            }
        }

    }
})();
