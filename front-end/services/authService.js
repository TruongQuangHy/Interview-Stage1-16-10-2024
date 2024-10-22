// services/authService.js
angular
  .module("authService", [])
  .factory("AuthService", function ($http, $window) {
    var authService = {};

    const API_BASE_URL = "http://localhost:5000/api/user";

    function getTokenConfig() {
      return {
        headers: {
          Authorization: "Bearer " + $window.localStorage.getItem("token"),
        },
        withCredentials: true,
      };
    }

    authService.login = function (credentials) {
      return $http
        .post(`${API_BASE_URL}/login`, credentials, { withCredentials: true })
        .then(function (response) {
          $window.localStorage.setItem("token", response.data.token);
          $window.localStorage.setItem("role", response.data.role);
          return response.data;
        });
    };

    authService.logout = function () {
      return $http
        .post(`${API_BASE_URL}/logout`, {}, { withCredentials: true })
        .then(function (response) {
          $window.localStorage.removeItem("token");
          $window.localStorage.removeItem("role");
          return response;
        });
    };

    authService.refreshToken = function () {
      return $http
        .post(`${API_BASE_URL}/refresh-token`, {}, getTokenConfig())
        .then(function (response) {
          $window.localStorage.setItem("token", response.data.accessToken);
          return response.data.accessToken;
        });
    };

    authService.isAuthenticated = function () {
      return !!$window.localStorage.getItem("token");
    };

    authService.getRole = function () {
      return $window.localStorage.getItem("role");
    };

    authService.isAdmin = function () {
      return authService.getRole() === "admin";
    };

    authService.getTokenConfig = getTokenConfig;

    return authService;
  });
