(function () {
  'use strict';

  angular.module('app')
    .controller('signupCtrl', [ '$http', '$state', signupCtrl]);

  function signupCtrl($http, $state) {
    var vm = this;
    vm.params = {};
    // function to submit the form after all validation has occurred
    vm.submitForm = function(isValid) {
      // check to make sure the form is completely valid
      if (isValid) {
        $http.post('/auth/register', vm.params)
          .success(function(data, status) {
            if (status === 200) $state.go('app');
          })
          .error(function(data) {
            vm.error= data;
          });
      }
    };
  }

})(); 