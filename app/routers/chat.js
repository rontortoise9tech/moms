var Chat = require("../models/chat");

module.exports = function (app)
{
    app.post("/chat/save",function(req, res, next)
    {
        Chat.create(req.body, function (err, application)
        {
            if (err)
                return res.send({'status':'fail','message':"Can not send message. Please try again."});

            return res.send({'status':'ok','message':"Succussfully applied."});
        });
    });

    app.post("/chat/list",function(req, res, next)
    {
        
        Chat.find({
            $and: [
                {
                    $or: [ { from : req.body.id }, { to : req.body.id } ]
                },
                {
                    $or: [ { from : req.body.receiver_id }, { to : req.body.receiver_id } ]
                }
            ]
        },
        {
            status: 0,
            _id: 0
        }).sort({ created_at: 1 }).exec(function (err, chats)
        {
            if(err)
                return res.end({'status':'fail', message : "Error getting message"});

            return res.send({'status':'ok', data : chats});
        });
    });
}