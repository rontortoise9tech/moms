var app = angular.module('moms.dashboard', []);

app.controller("dashboardController",function($scope,authService, $location, loadingService, $localStorage, socket, $rootScope, $timeout)
{
    $scope.sendMessage = function()
    {
        
    }

    $timeout(function()
    {
        if($localStorage.currentUser._id)
        {
            socket.emit("set connection",{
                socketID : $rootScope.currentUser._id
            });
        }
    },2000);
    
});