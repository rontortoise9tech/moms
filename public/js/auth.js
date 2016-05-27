var app = angular.module('moms.auth', []);

app.controller("loginController",function($scope,authService, $location, loadingService, $localStorage, $rootScope, socket)
{
    if($localStorage.currentUser)
    {
        $location.path("/dashboard");
    }

    $scope.login = function()
    {
        var loginData = {
            email : $scope.email,
            password : $scope.password
        };
        authService.login(loginData).then(function(response)
        {
            if(response.status == "ok")
            {
                $localStorage.currentUser   = response.user;
                $rootScope.currentUser      = response.user;
                
                socket.emit("set connection",{
                    socketID : response.user._id
                });
                
                $location.path("/dashboard");
            }
            else
            {
                loadingService.show('Login failed!');
            }
        });
    }
});

app.controller("logoutController",function($scope,authService, $location, loadingService, $localStorage)
{
    authService.logout().then(function(response)
    {
        if(response.status == "ok")
        {
            $localStorage.$reset();
//            $location.path("/login");
            window.location.href = "/login";
        }
    });
});

app.controller("signupController",function($scope, authService, loadingService, $routeParams, $location)
{
    var type = $routeParams.type;
    
    if(!type) {
        $location.path("/");
    }

    $scope.signupData = {};
    
    $scope.signupData.role = type;

    $scope.signup = function()
    {
        console.log($scope.signupData);
        authService.signup($scope.signupData).then(function(response)
        {
            if(response.status == "ok")
            {
                loadingService.show('Registered successfully!');
            }
        });
    }
});