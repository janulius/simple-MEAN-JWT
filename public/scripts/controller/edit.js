(function () {
  'use strict';

  angular.module('app')
    .controller('editCtrl', [ '$scope', '$http', editCtrl]);

  function editCtrl($scope, $http) {
    var vm = this;
    vm.params = {};
    $http.get('/auth/profile')
      .success(function(data) {
        vm.params.name = data.name;
      })
      .error(function(data) {
        console.log('Error: ' + data.message);
      });

    vm.submitForm = function(isValid) {
      // check to make sure the form is completely valid
      if (isValid) {
        $http.put('/auth/profile', vm.params)
          .success(function(data, status) {
            if (status === 200);
          })
          .error(function(data) {
            vm.error = data;
          });
      }
    };

  }

})(); 