var app = angular.module('moms', ['ngMaterial', 'ngRoute', 'ngMdIcons', 'moms.services', 'moms.auth', 'ngStorage', 'moms.dashboard', 'moms.profile', 'moms.directives', 'moms.chat']);

app.config(function ($routeProvider, $locationProvider, $mdIconProvider)
{
    $routeProvider.when('/',
    {
        templateUrl: 'partials/home.html',
        controller: 'homeController'
    })
    .when('/login', {
        templateUrl: 'partials/auth/login.html',
        controller: 'loginController'
    })
    .when('/signup/:type?', {
        templateUrl: 'partials/auth/signup.html',
        controller: 'signupController'
    })
    .when('/verfiy', {
        templateUrl: 'partials/auth/verfiy.html',
        controller: 'verfiyController'
    })
    .when('/dashboard', {
        templateUrl: 'partials/user/dashboard.html',
        controller: 'dashboardController'
    })
    .when('/profileStudent', {
        templateUrl: 'partials/profile/profile_student.html',
        controller: 'profileStudentController'
    })
    .when('/profileHost', {
        templateUrl: 'partials/profile/profile_host.html',
        controller: 'profileHostController'
    })
    .when('/list_hosts', {
        templateUrl: 'partials/list/list_hosts.html',
        controller: 'listHostController'
    })
    .when('/chat/:receiverID?', {
        templateUrl: 'partials/chat/chat.html',
        controller: 'chatController'
    })
    .when('/listapplication', {
        templateUrl: 'partials/list/listapplication.html',
        controller: 'listApplicationController'
    })
    .when('/student/view_application', {
        templateUrl: 'partials/list/listStudentApplication.html',
        controller: 'listStudentApplicationController'
    })
    .when('/logout', {
        template : "Logging out...",
        controller: "logoutController"
    });

    $locationProvider.html5Mode(true);
});

app.run(function ($log, $rootScope, $route, $rootScope, $location, $localStorage, $mdSidenav, socket, authService, loadingService)
{
    $route.reload();
    
    socket.on('get msg', function(data)
    {
        if ($location.path().substring(0, 6) !== "/chat/")
        {
            loadingService.incomingChat(data);
        }
    });

    $rootScope.currentUser = {};
    
    $rootScope.$on('$locationChangeStart', function (event, next, current)
    {
        console.log("page changed");
        var publicPages = ['/','/login', '/signup/student', '/signup/host','/verify', '/logout'];

        var restrictedPage = publicPages.indexOf($location.path()) === -1;

        if (restrictedPage)
        {
            authService.checkLogin().then(function(response)
            {
                if(response.status == "fail")
                {
                    $localStorage.$reset();
                    $location.path('/login');
                }
                else
                {
                    $localStorage.currentUser   = response.user;
                    $rootScope.currentUser      = response.user;
                }
            });
            
        }
    });
    
    $rootScope.$on('socket:broadcast', function(event, data)
    {
        console.debug('got a message', event.name);
        if (!data.payload)
        {
            console.error('invalid message', 'event', event, 'data', JSON.stringify(data));
            return;
        }
        
        $rootScope.$apply(function()
        {
            $rootScope.messageLog = messageFormatter(new Date(), data.source, data.payload) + $scope.messageLog;
        });
    });
    
    
    $rootScope.currentUser = $localStorage.currentUser;
    
    $rootScope.openSideNavPanel = function() {
        $mdSidenav('left').open();
    };
    $rootScope.closeSideNavPanel = function() {
        $mdSidenav('left').close();
    };
    
});


app.controller("homeController",function($scope,authService)
{
    
});

app.controller("verfiyController",function($scope,authService)
{
    
});