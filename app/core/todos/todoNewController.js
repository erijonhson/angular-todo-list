(function () {
    'use strict';

    angular.module('app.todos.new', ['ui.router', 'ngAnimate', 'app.todo'])

            .controller('TodosNewController', TodosNewController);

    TodosNewController.$inject = ['$http', '$stateParams', '$state', 'Todo', 'toastr'];

    function TodosNewController($http, $stateParams, $state, Todo, toastr) {

        var vm = this;
        vm.todo = {};

        (function() {
            if ($stateParams.todo != null) {
                vm.todo = $stateParams.todo;
            }
        })();

        vm.addTodo = function (todo) {
            const todoCtrl = new Todo(todo);
            todoCtrl.addTodo().then(function(data) {
                $state.go("root.todos.list", { todo: data.data });
            })
            .catch(function(data) {
                $state.go("root.todos.list");
            });
        }

        vm.updateTodo = function (todo) {
            const todoCtrl = new Todo(todo);
            todoCtrl.updateTodo().then(function(data) {
                $state.go("root.todos.list", { todo: data.data });
            })
            .catch(function(data) {
                $state.go("root.todos.list");
            });
        }

        vm.resolve = function (todo) {
            if (todo.id == null || todo.id == undefined || todo.id == '') {
                return this.addTodo(todo);
            } else {
                return this.updateTodo(todo);
            }
        }

    }
})();
