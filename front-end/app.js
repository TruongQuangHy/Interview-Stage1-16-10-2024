// app.js
var app = angular.module("myApp", [
  "ngRoute",
  "authService",
  "loginController",
  "homeController",
  "dashboardController",
]);

// Cấu hình các chức năng toàn cục cho ứng dụng (nếu có)
app.run(function ($rootScope, AuthService, $location) {
  $rootScope.isAuthenticated = function () {
    return AuthService.isAuthenticated();
  };

  $rootScope.isAdmin = function () {
    return AuthService.isAdmin();
  };

  $rootScope.logout = function () {
    AuthService.logout().then(function () {
      $location.path("/login");
    });
  };

  // Điều hướng người dùng nếu không có token
  $rootScope.$on("$routeChangeStart", function (next) {
    if (
      !AuthService.isAuthenticated() &&
      next.templateUrl !== "views/login.html"
    ) {
      $location.path("/login");
    }
  });
});
