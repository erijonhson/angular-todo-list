(function () {
    'use strict';

    angular.module('app.todos.list', ['ngAnimate', 'app.todo', 'app.sessionService', 'toastr'])

            .controller('TodosListController', TodosListController);

    TodosListController.$inject = ['Todo', 'sessionService', '$state', '$timeout', '$q', 'toastr'];

    function TodosListController(Todo, sessionService, $state, $timeout, $q, toastr) {

        var vm = this;
        vm.currentUser = sessionService.getLoggedUser();
        vm.modalShown = false;
        vm.todoModal;

        vm.toggleModal =function(todo) {
            vm.todoModal = todo;
            vm.modalShown = !vm.modalShown;
        }

        vm.getTodos = function() {
            return vm.currentUser.todos;
        }

        vm.updateTodoDone = function(todo) {
            todo.updateTodoDone().catch(function error(e) {
                todo.done = !todo.done;
                var message = e.errors ? e.errors : 
                    'Erro ao atualizar a tarefa.';
                toastr.error(message);
                return $q.reject(message);
            });
        }

        vm.deleteTodo = function (todo) {
            vm.currentUser.deleteTodo(todo).then(function() {
                $state.go('root.todos.list');
            })
            .catch(function error(e) {
                var message = e.errors ? e.errors : 
                    'Erro ao deletar a tarefa.';
                toastr.error(message);
                return $q.reject(message);
            });
        }

    }
})();
