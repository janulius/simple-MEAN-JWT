(function () {
  'use strict';

  angular.module('app')
    .config([ '$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

      $urlRouterProvider.otherwise('/');

      $stateProvider
        .state('app',{
          url: '/',
          cache: false,
          templateUrl: 'views/home.html',
          controller: 'homeCtrl',
          controllerAs : 'vm'
        })

        .state('signup',{
          url: '/signup',
          cache: false,
          templateUrl: 'views/signup.html',
          controller: 'signupCtrl',
          controllerAs : 'vm'
        })

        .state('edit',{
          url: '/edit',
          cache: false,
          templateUrl: 'views/edit.html',
          controller: 'editCtrl',
          controllerAs : 'vm',
          resolve: {
            loginRequired: loginRequired
          }
        })

      function loginRequired($q, $location, auth) {
        var deferred = $q.defer();
        if (auth.isAuthed()) {
          deferred.resolve();
        } else {
          $location.path('/signup');
        }
        return deferred.promise;
      }

    }]);
})();
