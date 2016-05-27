var ProfileHost = require("../models/profile_host");
var ProfileStudent = require("../models/profile_student");
var multer  = require('multer');
var path = require("path");
var fs = require('fs');

var filesArray = [];

var storage =   multer.diskStorage(
{
    destination: function (req, file, callback)
    {
        callback(null, path.join(__dirname,'../../public/uploads'));
    },
    filename: function (req, file, callback)
    {
        var uploadFileName = 'photos-' + Date.now()+".jpg";
        filesArray.push(uploadFileName);
        callback(null,  uploadFileName);
    }
});

var upload = multer({ storage : storage }).array('files[]',100);

var storageStudent =   multer.diskStorage(
{
    destination: function (req, file, callback)
    {
        callback(null, path.join(__dirname,'../../public/uploads'));
    },
    filename: function (req, file, callback)
    {
        var uploadFileName = 'photos-student-' + Date.now()+".jpg";
        filesArray = uploadFileName;
        callback(null,  uploadFileName);
    }
});

var uploadStudent = multer({ storage : storageStudent }).array('files[]',100);

module.exports = function (app)
{
    app.post("/deleteImage", function(req, res, next)
    {
        var filePath = path.join(__dirname,'../../public/uploads/'+req.body.image);
        
        fs.exists(filePath, function (exists)
        {
            if (exists)
            {
                ProfileHost.findOne({user_id : req.body.user_id}, function (err, profile)
                {
                    if(err)
                        return res.end("Error getting profile.");

                    if(profile)
                    {
                        var editPhotos = profile.photos.filter(function (item)
                        {
                            return item != req.body.image
                        });

                        ProfileHost.update({_id : profile._id}, { photos : editPhotos }, function (err, profile)
                        {
                            fs.unlink(filePath);

                            if (err)
                                return res.send({'status':'fail','message':"Can not update profile. Please try again."});
        
                            return res.send({'status':'ok','message':"Profile saved.", data : editPhotos});
                        });
                    }
                    else
                    {
                        return res.send({'status':'fail','message':"Can not find profile."});
                    }
                });
            }
            else
            {
                return res.send({'status':'fail','message':"Can not find profile."});
            }
        });
    });

    app.post("/deleteImageStudent", function(req, res, next)
    {
        var filePath = path.join(__dirname,'../../public/uploads/'+req.body.image);
        
        fs.exists(filePath, function (exists)
        {
            if (exists)
            {
                ProfileStudent.findOne({user_id : req.body.user_id}, function (err, profile)
                {
                    if(err)
                        return res.end("Error getting profile.");

                    if(profile)
                    {
                        ProfileStudent.update({_id : profile._id}, { photos : '' }, function (err, profile)
                        {
                            fs.unlink(filePath);

                            if (err)
                                return res.send({'status':'fail','message':"Can not update profile. Please try again."});
        
                            return res.send({'status':'ok','message':"Profile saved.", data : ''});
                        });
                    }
                    else
                    {
                        return res.send({'status':'fail','message':"Can not find profile."});
                    }
                });
            }
            else
            {
                return res.send({'status':'fail','message':"Can not find profile."});
            }
        });
    });

    app.post("/uploadStudentPhotos/:id", function (req, res, next)
    {
        filesArray = "";
        uploadStudent(req,res,function(err)
        {
            if(err) {
                return res.end("Error uploading file.");
            }
            
            ProfileStudent.findOne({user_id : req.params.id}, function (err, profile)
            {
                console.log(err);
                if(err)
                    return res.end("Error uploading file.");

                if(profile)
                {
                    if(profile.photos)
                    {
                        var filePath = path.join(__dirname,'../../public/uploads/'+profile.photos);
                        fs.unlink(filePath);
                    }

                    ProfileStudent.update({_id : profile._id}, { photos : filesArray }, function (err, profile)
                    {
                        if (err)
                            return res.send({'status':'fail','message':"Can not update profile. Please try again."});

                        return res.send({'status':'ok','message':"Profile saved.", data : filesArray});
                    });
                }
                else
                {
                    return res.send({'status':'fail','message':"Can not find profile."});
                }
            });
        });
    });

    app.post("/uploadPhotos/:id", function (req, res, next)
    {
        filesArray = [];
        upload(req,res,function(err)
        {
            if(err) {
                return res.end("Error uploading file.");
            }
            
            ProfileHost.findOne({user_id : req.params.id}, function (err, profile)
            {
                console.log(err);
                if(err)
                    return res.end("Error uploading file.");

                if(profile)
                {
                    filesArray = filesArray.concat(profile.photos);
                    ProfileHost.update({_id : profile._id}, { photos : filesArray }, function (err, profile)
                    {
                        if (err)
                            return res.send({'status':'fail','message':"Can not update profile. Please try again."});

                        return res.send({'status':'ok','message':"Profile saved.", data : filesArray});
                    });
                }
                else
                {
                    return res.send({'status':'fail','message':"Can not find profile."});
                }
            });
        });
    });
    
    app.post("/getHostDetail", function (req, res, next)
    {
        ProfileHost.findOne({ _id : req.body._id }).populate('user_id').exec(function (err, profiles)
        {
            if (err)
                return res.send({'status':'fail','message':"Can not get hosts list. Please try again."});

            return res.send({'status':'ok','message':"Profile lists.", data : profiles});
        });
    });
    
    app.get("/getAllHosts", function (req, res, next)
    {
        ProfileHost.find({}).populate('user_id').exec(function (err, profiles)
        {
            if (err)
                return res.send({'status':'fail','message':"Can not get hosts list. Please try again."});

            return res.send({'status':'ok','message':"Profile lists.", data : profiles});
        });
    });

    app.post('/saveProfile', function (req, res, next)
    {
        delete req.body.amenitiesArr;
        console.log(req.body);

        ProfileHost.findOne({user_id : req.body.user_id}, function (err, profile)
        {
            if(profile)
            {
                ProfileHost.update({_id : profile._id}, req.body, function (err, profile)
                {
                    if (err)
                        return res.send({'status':'fail','message':"Can not update profile. Please try again."});
                    
                    return res.send({'status':'ok','message':"Profile saved.", data : profile});
                });
                
            }
            else
            {
                ProfileHost.create(req.body, function (err, profile)
                {
                    if (err)
                    {
                        console.log(err);
                        return res.send({'status':'fail','message':"Can not update profile. Please try again."});
                    }
                    return res.send({'status':'ok','message':"Profile saved."});
                });
            }
        });
    });
    
    app.get('/getProfile', function (req, res, next)
    {
        ProfileHost.findOne({user_id : req.query.profileID}, function (err, profile)
        {
            if (err || !profile)
                return res.send({'status':'fail','message':"Can not find profile. Please try again."});

            if(profile)
            {
                return res.send({'status':'ok','message':"Profile found.", data : profile});
            }
        });
    });
    
    app.get('/getStudentProfile', function (req, res, next)
    {
        ProfileStudent.findOne({user_id : req.query.profileID}, function (err, profile)
        {
            if (err || !profile)
                return res.send({'status':'fail','message':"Can not find profile. Please try again."});

            if(profile)
            {
                return res.send({'status':'ok','message':"Profile found.", data : profile});
            }
        });
    });
    
    app.post('/saveStudentProfile', function (req, res, next)
    {
        console.log(req.body);

        ProfileStudent.findOne({user_id: req.body.user_id}, function (err, profile)
        {
            if (profile)
            {
                ProfileStudent.update({_id: profile._id}, req.body, function (err, profile)
                {
                    if (err)
                        return res.send({'status': 'fail', 'message': "Can not update profile. Please try again."});

                    return res.send({'status': 'ok', 'message': "Profile saved.", data: profile});
                });

            }
            else
            {
                ProfileStudent.create(req.body, function (err, profile)
                {
                    if (err)
                    {
                        console.log(err);
                        return res.send({'status': 'fail', 'message': "Can not update profile. Please try again."});
                    }
                    return res.send({'status': 'ok', 'message': "Profile saved."});
                });
            }
        });
    });
}