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

      getPost();
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
              if (data.list) {
                vm.posts = ago(data.list);
              }
            }
          })
          .error(function(data) {
            console.log('Error: ' + data);
          });
      }
    };

    vm.delete = function (id) {
      console.log(id);
      $http.delete('/api/posts/' + id)
        .success(function(data, status) {
          if (status === 200 && data.nModified == 1) getPost();
        })
        .error(function(data) {
          console.log('Error: ' + data);
        });
    };

    vm.logout = function () {
      $window.localStorage.removeItem('jwtToken');
    };

    function getPost() {
      $http.get('/api/posts')
        .success(function(data) {
          if (data.list) {
            vm.posts = ago(data.list);
          }
        })
        .error(function(data) {
          console.log('Error: ' + data);
        });
    }

    function ago(list) {
      for (var i = 0; i < list.length; i++) {
        list[i].ago = moment(list[i].created_at).fromNow();
      }
      return list;
    }

  }

})(); 