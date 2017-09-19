(function () {
    'use strict';

    angular.module('app', [
        'ui.router',
        'toastr',
        'app.nav.breadcrumbs',
        'app.nav.footer',
        'app.nav.header',
        'app.nav.menu',
        'app.todo',
        'app.todos.list',
        'app.directives.datepicker',
        'app.directives.about',
        'app.filters',
        'app.session',
        'app.sessionService',
        'app.user'
    ]);
})();
