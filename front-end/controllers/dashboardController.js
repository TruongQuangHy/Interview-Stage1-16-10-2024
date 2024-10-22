// controllers/dashboardController.js
angular
  .module("dashboardController", [])
  .controller(
    "DashboardController",
    function ($scope, $http, AuthService, $location) {
      $scope.loading = true;

      function handleToken() {
        if (!AuthService.isAuthenticated()) {
          $location.path("/login");
          return Promise.reject("Not authenticated");
        }

        return AuthService.refreshToken().catch(() => {
          $location.path("/login");
          return Promise.reject("Token refresh failed");
        });
      }

      function fetchData() {
        $http
          .get(`${API_BASE_URL}/all-users`, AuthService.getTokenConfig())
          .then(function (response) {
            $scope.users = response.data;
          })
          .catch(function (error) {
            console.error("Error fetching users:", error);
            alert("An error occurred while fetching users.");
          })
          .finally(function () {
            $scope.loading = false;
          });
      }

      handleToken().then(fetchData);
    }
  );
