var app = angular.module('moms.services', []);

app.constant("CONFIG",{
//    SITE_URL : "http://localhost:9090"
    SITE_URL : "https://momsdemo.herokuapp.com"

});

app.factory('socket', function($rootScope)
{
//    var socket = io.connect("http://localhost:9090");
    var socket = io.connect("https://momsdemo.herokuapp.com");
    return {
        on: function (eventName, callback)
        {
            socket.on(eventName, function ()
            {
                var args = arguments;
                $rootScope.$apply(function ()
                {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function (eventName, data, callback)
        {
            socket.emit(eventName, data, function ()
            {
                console.log("comes");
                var args = arguments;
                $rootScope.$apply(function ()
                {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            })
        }
    };
});

app.factory('authService', ['$http', '$q', 'CONFIG', function ($http, $q, CONFIG)
{
    var service = {
        checkLogin : checkLogin,
        login   : login,
        logout   : logout,
        signup  : signup
    };

    return service;
    
    function checkLogin()
    {
        var def = $q.defer();

        $http.get(CONFIG.SITE_URL+"/checkLogin").success(function (data)
        {
            def.resolve(data);
        })
        .error(function ()
        {
            def.reject("Failed to login");
        });

        return def.promise;
    }
    
    function logout()
    {
        var def = $q.defer();

        $http.get(CONFIG.SITE_URL+"/logout").success(function (data)
        {
            def.resolve(data);
        })
        .error(function ()
        {
            def.reject("Failed to login");
        });

        return def.promise;
    }
    
    function login(data)
    {
        var def = $q.defer();

        $http.post(CONFIG.SITE_URL+"/login",data).success(function (data)
        {
            console.log(data);
            def.resolve(data);
        })
        .error(function ()
        {
            def.reject("Failed to login");
        });

        return def.promise;
    }

    function signup(data)
    {
        var def = $q.defer();

        $http.post(CONFIG.SITE_URL+"/signup",data).success(function (data)
        {
            console.log(data);
            def.resolve(data);
        })
        .error(function ()
        {
            def.reject("Failed to login");
        });

        return def.promise;
    }
}]);

app.factory('apiService', ['$http', '$q', 'CONFIG', function ($http, $q, CONFIG)
{
    var service = {
        saveProfile : saveProfile,
        getProfile : getProfile,
        getStudentProfile : getStudentProfile,
        saveStudentProfile : saveStudentProfile,
        getAllHosts : getAllHosts,
        uploadPhotos : uploadPhotos,
        getHostDetail : getHostDetail,
        deleteImage : deleteImage,
        makeHttpPostCall : makeHttpPostCall
    };

    return service;
    
    function makeHttpPostCall(requestData)
    {
        var def = $q.defer();
        console.log(requestData);
        $http.post(CONFIG.SITE_URL+requestData.url,requestData.data).success(function (data)
        {
            def.resolve(data);
        })
        .error(function ()
        {
            def.reject("Failed to save profile");
        });

        return def.promise;
    }
    
    function deleteImage(data)
    {
        var def = $q.defer();

        $http.post(CONFIG.SITE_URL+"/deleteImage",data).success(function (data)
        {
            def.resolve(data);
        })
        .error(function ()
        {
            def.reject("Failed to save profile");
        });

        return def.promise;
    }
    
    function getHostDetail(host)
    {
        var def = $q.defer();

        $http.post(CONFIG.SITE_URL+"/getHostDetail",host).success(function (data)
        {
            def.resolve(data);
        })
        .error(function ()
        {
            def.reject("Failed to save profile");
        });

        return def.promise;
    }
    
    function uploadPhotos(files)
    {
        var def = $q.defer();

        $http.post(CONFIG.SITE_URL+"/uploadPhotos",{
            photos : files
        }).success(function (data)
        {
            def.resolve(data);
        })
        .error(function ()
        {
            def.reject("Failed to save profile");
        });

        return def.promise;
    }
    
    function saveProfile(data)
    {
        var def = $q.defer();

        $http.post(CONFIG.SITE_URL+"/saveProfile",data).success(function (data)
        {
            def.resolve(data);
        })
        .error(function ()
        {
            def.reject("Failed to save profile");
        });

        return def.promise;
    }
    
    function getProfile(profileID)
    {
        var def = $q.defer();

        $http.get(CONFIG.SITE_URL+"/getProfile/?profileID="+profileID).success(function (data)
        {
            def.resolve(data);
        })
        .error(function ()
        {
            def.reject("Failed to get profile.");
        });

        return def.promise;
    }
    
    function getStudentProfile(profileID)
    {
        var def = $q.defer();

        $http.get(CONFIG.SITE_URL+"/getStudentProfile/?profileID="+profileID).success(function (data)
        {
            def.resolve(data);
        })
        .error(function ()
        {
            def.reject("Failed to get profile.");
        });

        return def.promise;
    }
    
    function saveStudentProfile(data)
    {
        var def = $q.defer();

        $http.post(CONFIG.SITE_URL+"/saveStudentProfile",data).success(function (data)
        {
            def.resolve(data);
        })
        .error(function ()
        {
            def.reject("Failed to save profile");
        });

        return def.promise;
    }
    
    function getAllHosts()
    {
        var def = $q.defer();

        $http.get(CONFIG.SITE_URL+"/getAllHosts").success(function (data)
        {
            def.resolve(data);
        })
        .error(function ()
        {
            def.reject("Failed to save profile");
        });

        return def.promise;
    }

}]);

app.factory('loadingService', function ($mdToast)
{
    return {
        show : function(msg)
        {
            $mdToast.show($mdToast.simple().textContent(msg).position('bottom right').hideDelay(3000));
        },
        incomingChat : function(chat) {
            $mdToast.show({
                template: '<md-toast>'+
                    '<span flex>You have new message!</span>'+
                    '<md-button ng-href="/chat/'+chat.from+'">'+
                        'Go to chat'+
                    '</md-button>'+
                  '</md-toast>',
                hideDelay: 6000,
                position: 'bottom right'
            });
        }
    }
});