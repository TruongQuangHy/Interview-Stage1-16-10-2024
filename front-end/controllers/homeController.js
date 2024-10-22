// controllers/homeController.js
angular
  .module("homeController", [])
  .controller("HomeController", function (AuthService, $location) {
    if (!AuthService.isAuthenticated()) {
      $location.path("/login");
    }
  });
