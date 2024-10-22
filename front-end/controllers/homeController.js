// controllers/homeController.js
angular
  .module("homeController", [])
  .controller("HomeController", function ($scope, AuthService, $location) {
    if (!AuthService.isAuthenticated()) {
      $location.path("/login");
    }
  });
