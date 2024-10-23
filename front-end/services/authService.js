angular
  .module("authService", [])
  .factory("AuthService", function ($http, $window) {
    var authService = {};

    const API_BASE_URL = "http://localhost:5000/api/user";

    // Configure headers with token from localStorage
    function getTokenConfig() {
      return {
        headers: {
          Authorization: "Bearer " + $window.localStorage.getItem("token"),
        },
        withCredentials: true,
      };
    }

    // Login function, stores token and role
    authService.login = function (credentials) {
      return $http
        .post(`${API_BASE_URL}/login`, credentials, { withCredentials: true })
        .then(function (response) {
          // Check if login requires OTP
          if (response.data.message && response.data.message.includes("OTP")) {
            return { otpRequired: true };
          }
        });
    };

    // OTP verification function
    authService.verifyOtp = function (otpPayload) {
      return $http
        .post(`${API_BASE_URL}/verify-otp`, otpPayload, {
          withCredentials: true,
        })
        .then(function (response) {
          if (response.data && response.data.token) {
            // OTP success, store token and role
            $window.localStorage.setItem("token", response.data.token);
            $window.localStorage.setItem("role", response.data.role);
            return response.data.token;
          } else {
            throw new Error("OTP verification failed.");
          }
        });
    };

    // Refresh token function
    authService.refreshToken = function () {
      return $http
        .post(`${API_BASE_URL}/refresh-token`, {}, getTokenConfig())
        .then(function (response) {
          if (response.data && response.data.accessToken) {
            $window.localStorage.setItem("token", response.data.accessToken);
            return response.data.accessToken;
          } else {
            throw new Error("Token refresh failed.");
          }
        })
        .catch(function (error) {
          console.error("Token refresh failed:", error);
          throw error;
        });
    };

    // Check if the user is authenticated
    authService.isAuthenticated = function () {
      return !!$window.localStorage.getItem("token");
    };

    // Get user's role
    authService.getRole = function () {
      return $window.localStorage.getItem("role");
    };

    // Check if the user is an admin
    authService.isAdmin = function () {
      return authService.getRole() === "admin";
    };

    // Logout user
    authService.logout = function () {
      return $http
        .post(`${API_BASE_URL}/logout`, {}, { withCredentials: true })
        .then(function (response) {
          $window.localStorage.removeItem("token");
          $window.localStorage.removeItem("role");
          return response;
        });
    };

    authService.getTokenConfig = getTokenConfig;

    return authService;
  });
