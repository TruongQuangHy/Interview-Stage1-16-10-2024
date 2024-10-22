// controllers/loginController.js
angular
  .module("loginController", [])
  .controller("LoginController", function ($scope, $location, AuthService) {
    $scope.credentials = {};

    $scope.login = function () {
      AuthService.login($scope.credentials)
        .then(function () {
          if (AuthService.isAdmin()) {
            $location.path("/dashboard");
          } else {
            $location.path("/");
          }
        })
        .catch(function () {
          alert("Invalid login credentials!");
        });
    };
  });
