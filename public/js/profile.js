var app = angular.module('moms.profile', []);

app.controller("profileStudentController",function($scope, apiService, loadingService, $http, CONFIG)
{
    $scope.profileStudent = {};
    $scope.maxDateCheckin  = new Date();
    $scope.minDateCheckout = new Date();

    $scope.$watch("profileStudent.check_in",function(newValue, oldValue)
    {
        if(oldValue)
        {
            $scope.minDateCheckout = new Date(newValue);
            $scope.profileStudent.check_out = "";
        }
    });
    
    apiService.getStudentProfile($scope.currentUser._id).then(function(response)
    {
        if(response.data)
        {
            $scope.profileStudent = response.data;
            $scope.profileStudent.date_of_birth = new Date(response.data.date_of_birth);
            $scope.profileStudent.check_in = new Date(response.data.check_in);
            $scope.profileStudent.check_out = new Date(response.data.check_out);
        }
    });
    
    var formData = new FormData();
    $scope.getTheFiles = function ($files)
    {
        angular.forEach($files, function (value, key)
        {
            console.log(value);
            formData.append('files[]', value);
        });
    };
    
    $scope.saveStudentProfile = function ()
    {
        $scope.profileStudent.user_id = $scope.currentUser._id;
        
        console.log($scope.profileStudent);
        
        apiService.saveStudentProfile($scope.profileStudent).then(function (response)
        {
            loadingService.show(response.message);
            $http.post(CONFIG.SITE_URL+"/uploadStudentPhotos/"+$scope.currentUser._id,formData,{
                headers: {
                    'Content-Type': undefined
                }
            }).success(function (data)
            {
                console.log(data);
                $scope.profileStudent.photos = data.data;
            })
            .error(function ()
            {
                console.log("Failed to save profile");
            });
        });
    }
    
    $scope.removeImage = function(img)
    {
        var params = {
            url : '/deleteImageStudent',
            data : {
                'image' : img,
                'user_id' : $scope.currentUser._id
            }
        }

        apiService.makeHttpPostCall(params).then(function(response)
        {
            if(response.status != "fail")
                $scope.profileStudent.photos = response.data;
        });
    }
});

app.controller("profileHostController",function($scope, apiService, loadingService, $http, CONFIG)
{
    $scope.personCount = 1;
    $scope.profile = {};

    $scope.amenities = [
        "kitchen",
        "internet",
        "tv",
        "heating",
        "air conditioning",
        "reserved parking",
        "washer",
        "dryer",
        "hottub",
        "pool"
    ];
    
    $scope.profile.member = [{
        name : "",
        age : "",
        gender : "",
        fieldofwork : ""  
    }];
    
    apiService.getProfile($scope.currentUser._id).then(function(response)
    {
        console.log(response);
        if(response.status == "fail")
        {
//            loadingService.show(response.message);
        }
        
        if(response.data)
        {
            $scope.profile = response.data;
            
            if(response.data.member[0].length > 1)
            {
                $scope.profile.member = response.data.member[0];
            }
            else
            {
                $scope.profile.member = response.data.member;
            }

            $scope.profile.amenitiesArr = $scope.profile.amenities.split(",");
            
            obj={};

            for(i=0; i<$scope.profile.amenitiesArr.length; i++)
            {
               obj[$scope.profile.amenitiesArr[i]] = true;
            }

            $scope.profile.amenitiesArr = obj;
            $scope.photos = response.data.photos;
        }
    });

    $scope.getNumber = function(num)
    {
        return new Array(num);
    }
    
    $scope.increasepersonCount = function()
    {
//        $scope.personCount++;
        $scope.profile.member.push({
            name : "",
            age : "",
            gender : "",
            fieldofwork : ""  
        });
    }
    
    var formData = new FormData();
    $scope.getTheFiles = function ($files)
    {
        angular.forEach($files, function (value, key)
        {
            console.log(value);
            formData.append('files[]', value);
        });
    };

    $scope.saveHostProfile = function()
    {
        $scope.profile.user_id = $scope.currentUser._id;
        if($scope.profile.amenitiesArr)
        {
            $scope.profile.amenities = Object.keys($scope.profile.amenitiesArr).toString();
        }

        apiService.saveProfile($scope.profile).then(function(response)
        {
            loadingService.show(response.message);
            console.log(formData);
//            apiService.uploadPhotos(formData).then(function(response)
//            {
//                console.log(response);
//            });

            $http.post(CONFIG.SITE_URL+"/uploadPhotos/"+$scope.currentUser._id,formData,{
                headers: {
                    'Content-Type': undefined
                }
            }).success(function (data)
            {
                console.log(data);
                $scope.photos = data.data;
            })
            .error(function ()
            {
                console.log("Failed to save profile");
            });

        });

        console.log($scope.profile);
    }
    
    $scope.removeImage = function(img)
    {
        var data = {
            'image' : img,
            'user_id' : $scope.currentUser._id
        }
        
        apiService.deleteImage(data).then(function(response)
        {
            if(response.status != "fail")
                $scope.photos = response.data;
        });
    }
});

app.controller("listHostController",function($scope, apiService, loadingService, $mdDialog, $mdMedia)
{
    $scope.hosts = {};

    apiService.getAllHosts().then(function(response)
    {
        if(response.status == "fail")
        {
            loadingService.show(response.message);
        }
        else
        {
            $scope.hosts = response.data;
        }
    });
    
    $scope.getHostDetails = function(host)
    {
        console.log(host);
        apiService.getHostDetail(host).then(function(response)
        {
            if(response.status == "fail")
            {
                loadingService.show(response.message);
                $mdDialog.hide();
            }
            else
            {
                $scope.hostsDetails = response.data;
            }
        });
    }
    
    $scope.showHostDetails = function(e,host)
    {
        $scope.hostsDetails = {};
        $mdDialog.show({
            clickOutsideToClose: true,
            scope: $scope,        
            preserveScope: true,
            templateUrl : "/partials/list/host_details.html",
            controller: function DialogController($scope, $mdDialog)
            {
                $scope.hostsDetails = host;
                $scope.close = function()
                {
                    $mdDialog.hide();
                }

                $scope.applyToHost = function(host)
                {
                    var requestParams = {
                        url : '/application/save',
                        data : {
                            student_id : $scope.currentUser._id,
                            host_id : host
                        }
                    };
                    apiService.makeHttpPostCall(requestParams).then(function(response)
                    {
                        loadingService.show(response.message);
                        $mdDialog.hide();
                    });
                }
            },
            fullscreen :$mdMedia('xs')
        });
    }
});

app.controller("listApplicationController",function($scope, apiService, loadingService, $location)
{
    var requestParams = {
        url : '/application/host/list',
        data : {
            host_id : $scope.currentUser._id
        }
    };
    
    $scope.applications = {};
    
    $scope.gotochat = function(receiverID)
    {
        $location.path('/chat/'+ receiverID);
    }
    
    apiService.makeHttpPostCall(requestParams).then(function(response)
    {
        if(response.status == "fail")
        {
            loadingService.show(response.message);
        }

        if(response.data)
        {
            $scope.applications = response.data;
        }
    });
});

app.controller("listStudentApplicationController",function($scope, apiService, loadingService, $location)
{
    var requestParams = {
        url : '/application/student/list',
        data : {
            student_id : $scope.currentUser._id
        }
    };
    
    $scope.applications = {};
    
    $scope.gotochat = function(receiverID)
    {
        $location.path('/chat/'+ receiverID);
    }
    
    apiService.makeHttpPostCall(requestParams).then(function(response)
    {
        if(response.status == "fail")
        {
            loadingService.show(response.message);
        }

        if(response.data)
        {
            $scope.applications = response.data;
        }
    });
});