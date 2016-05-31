var app = angular.module('moms.chat', []);

app.controller('chatController', function($scope, socket, $routeParams, $location, loadingService, apiService, $timeout)
{
    var receiverID = $routeParams.receiverID;

    if(!receiverID) {
        $location.path("/dashboard");
    }

    $scope.msgs = [];
    $scope.chat = {};
    
    apiService.makeHttpPostCall({
        url : '/chat/list',
        data : {
            id : $scope.currentUser._id,
            receiver_id : receiverID
        }
    }).then(function(response)
    {
        if(response.status == "ok" && response.data)
        {
            $scope.msgs = response.data;
            $timeout(function()
            {
                var objDiv = document.getElementById("chatScrolling");
                objDiv.scrollTop = objDiv.scrollHeight;
            },500);
        }
    });
    
    $scope.profile = {};
    
    if($scope.currentUser.role == "host")
    {
        apiService.getStudentProfile(receiverID).then(function(response)
        {
            if(response.data)
            {
                $scope.profile = response.data;
            }
        });
    }
    else if($scope.currentUser.role == "student")
    {
        apiService.getProfile(receiverID).then(function(response)
        {
            if(response.data)
            {
                $scope.profile = response.data;
            }
        });
    }

    $scope.sendMsg = function()
    {
        var chatParmas = {
            msg : $scope.chat.msg,
            from : $scope.currentUser._id,
            to : receiverID,
            socketID : receiverID
        };
        
        apiService.makeHttpPostCall({
            url : '/chat/save',
            data : chatParmas
        }).then(function(response)
        {
            var objDiv = document.getElementById("chatScrolling");
            objDiv.scrollTop = objDiv.scrollHeight;

            if(response.status == "ok")
               socket.emit('send msg', chatParmas);
            else
                loadingService.show(response.message);
        });
        
        $scope.msgs.push({
            msg : $scope.chat.msg,
            from : $scope.currentUser._id,
            to : receiverID,
            created_at : new Date()
        });
        $scope.chat.msg = '';
    };

    socket.on('get msg', function(data)
    {
        $scope.msgs.push(data);
        
        $timeout(function()
        {
            var objDiv = document.getElementById("chatScrolling");
            objDiv.scrollTop = objDiv.scrollHeight;
        },500);
    });
});