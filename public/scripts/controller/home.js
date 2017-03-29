(function () {
  'use strict';

  angular.module('app')
    .controller('homeCtrl', [ '$scope', '$http', '$state', 'auth', '$window', homeCtrl]);

  function homeCtrl($scope, $http, $state, auth, $window) {
    var vm = this;
    vm.params = {};
    vm.isAuthed = function() {
      return auth.isAuthed ? auth.isAuthed() : false
    };

    if (auth.isAuthed()) {
      $http.get('/auth/profile')
        .success(function(data) {
          vm.name = data.name;
        })
        .error(function(data) {
          console.log('Error: ' + data.message);
        });

      $http.get('/api/posts')
        .success(function(data) {
          vm.posts = data.list;
        })
        .error(function(data) {
          console.log('Error: ' + data);
        });
    }

    // function to submit the form after all validation has occurred
    vm.submitForm = function(isValid) {
      // check to make sure the form is completely valid
      if (isValid) {
        $http.post('/auth/login', vm.params)
          .success(function(data, status) {
            if (status === 200) vm.name = data.name;
          })
          .error(function(data) {
            vm.error = data;
          });
      }
    };

    vm.submitPostForm = function(isValid) {
      if (isValid) {
        $http.post('/api/posts', { text: vm.textPost })
          .success(function(data, status) {
            if (status === 200) {
              vm.textPost = '';
              vm.posts = data.list;
            }
          })
          .error(function(data) {
            console.log('Error: ' + data);
          });
      }
    };

    vm.logout = function () {
      $window.localStorage.removeItem('jwtToken');
    };
  }

})(); 