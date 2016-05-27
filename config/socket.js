module.exports = function (io)
{
    'use strict';
    
    var clients = {};
    
    io.on('connection', function (socket)
    {
        socket.on('set connection', function(data)
        {
            socket.join(data.socketID);
        });

        socket.on('send msg', function(data)
        {
            io.sockets.in(data.socketID).emit('get msg', data);
        });

    });
};
