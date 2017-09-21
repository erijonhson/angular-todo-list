(function () {
    'use strict';

    angular.module('app.todos.list', ['ngAnimate', 'app.todo', 'toastr'])

            .controller('TodosListController', TodosListController);

    TodosListController.$inject = ['Todo', '$stateParams', '$scope', 'toastr'];

    function TodosListController(Todo, $stateParams, $scope, toastr) {

        var vm = this;
        vm.todos = [];

        (function() {
            resolveTodosList();
            resolveAddOrUpdateTodoElement();
        })();

        vm.deleteTodo = function (todo) {
            const todoCtrl = new Todo(todo);
            todoCtrl.deleteTodo().then(function(data) {
                const todo = data.data;
                vm.todos = vm.todos.filter(function(item) {
                    return item.id !== todo.id
                });
            })
        }

        function resolveTodosList() {
            vm.todos = $stateParams.todos;
        }

        function resolveAddOrUpdateTodoElement() {
            if ($stateParams.todo != null) {
                const todo = $stateParams.todo;
                vm.todos = $stateParams.todos;

                // update
                var updated = false;
                for (var i in vm.todos) {
                    if (vm.todos[i].id == todo.id) {
                        vm.todos[i] = todo;
                        updated = true;
                        break;
                    }
                }

                // add
                if (!updated) {
                    vm.todos.push(new Todo(todo));
                }
            }
        }
    }
})();
