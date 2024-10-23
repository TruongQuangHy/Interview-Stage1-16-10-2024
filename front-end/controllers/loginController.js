angular
  .module("loginController", ["authService"]) // Load authService module here
  .controller(
    "LoginController",
    function ($scope, $http, $location, $window, AuthService) {
      $scope.credentials = { otp: "", email: "", password: "" };
      $scope.otpRequired = false;

      $scope.login = function () {
        AuthService.login($scope.credentials)
          .then(function (response) {
            if (response.otpRequired) {
              $scope.otpRequired = true;
            } else {
              $location.path("/dashboard");
            }
          })
          .catch(function (error) {
            alert(
              "Login failed: " +
                (error.data ? error.data.message : "Unknown error occurred.")
            );
          });
      };

      $scope.verifyOtp = function () {
        const otpPayload = {
          email: $scope.credentials.email,
          otp: $scope.credentials.otp,
        };

        AuthService.verifyOtp(otpPayload)
          .then(function () {
            $location.path("/dashboard");
          })
          .catch(function (error) {
            alert(
              "OTP verification failed: " +
                (error.data ? error.data.message : "Unknown error occurred.")
            );
          });
      };
    }
  );
