// routes.js
app.config(function ($routeProvider) {
  $routeProvider
    .when("/login", {
      templateUrl: "views/login.html",
      controller: "LoginController",
    })
    .when("/", {
      templateUrl: "views/home.html",
      controller: "HomeController",
    })
    .when("/dashboard", {
      templateUrl: "views/dashboard.html",
      controller: "DashboardController",
    })
    .otherwise({
      redirectTo: "/login",
    });
});
