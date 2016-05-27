var ProfileHost = require("../models/profile_host");
var ProfileStudent = require("../models/profile_student");
var Applications = require("../models/applications");

module.exports = function (app)
{
    app.post("/application/save",function(req, res, next)
    {
        Applications.findOne({student_id : req.body.student_id , host_id : req.body.host_id}, function (err, applications)
        {
            if(err)
                return res.end("Error getting application details");

            if(applications)
            {
                return res.send({'status':'ok','message':"Already applied."});
            }
            else
            {
                Applications.create(req.body, function (err, application)
                {
                    if (err)
                    {
                        console.log(err);
                        return res.send({'status':'fail','message':"Can not apply. Please try again."});
                    }
                    return res.send({'status':'ok','message':"Succussfully applied."});
                });
            }
        });
    });

    app.post("/application/host/list",function(req, res, next)
    {
        console.log(req.body);
        
        Applications.find({ host_id : req.body.host_id }).populate('student_id').exec(function (err, applications)
        {
            if(err)
                return res.end("Error getting application details");

            return res.send({'status':'ok','message':"Succussfully applied.", data : applications});
        });

    });

    app.post("/application/student/list",function(req, res, next)
    {
        console.log(req.body);
        
        Applications.find({ student_id : req.body.student_id }).populate('host_id').exec(function (err, applications)
        {
            if(err)
                return res.end("Error getting application details");

            return res.send({'status':'ok','message':"Succussfully applied.", data : applications});
        });

    });
}