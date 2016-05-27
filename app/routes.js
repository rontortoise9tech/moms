var User = require('./models/user');
var localStorage = require('localStorage');

module.exports = function (app, passport) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================

    app.get('/', function (req, res)
    {
        res.render('index');
    });

    app.get('/checkLogin', function (req, res)
    {
        if(req.session.passport.user) {
            res.send({ 'status':'ok', user : req.session.passport.user });
        }
        else
        {
            res.send({ 'status':'fail' });
        }
    });

    // =====================================
    // LOGIN ===============================
    // =====================================

    app.post("/login",function(req, res, next)
    {
        passport.authenticate('local-login', function(err, user, info)
        {
            if (err)
            {
                return res.send({'status':'err','message':err.message});
            }

            if (!user)
            {
                return res.send({'status':'fail','message':info.message});
            }

            req.logIn(user, function(err)
            {
                if (err)
                {
                    return res.send({'status':'err','message':err.message});
                }
                return res.send({'status':'ok', user : user});
            });
        })(req, res, next);
    });

    // =====================================
    // SIGNUP ==============================
    // =====================================

    app.post('/signup', function(req,res,next)
    {
        console.log('before authenticate');
        passport.authenticate('local-signup', function(err, user, info)
        {
            console.log('authenticate callback');
            if (err)
            {
                return res.send({'status':'err','message':err.message});
            }

            if (!user)
            {
                return res.send({'status':'fail','message':info.message});
            }

            req.logIn(user, function(err)
            {
                if (err)
                {
                    return res.send({'status':'err','message':err.message});
                }
                return res.send({'status':'ok'});
            });
        })(req, res, next);
    });
    
    app.get('/verify',function(req,res)
    {   
        User.findOne({'email': req.query.email}, function (err, user)
        {
            if (err)
                return done(err);

            if(user)
            {
                //http://localhost:9090/verify?email=dave.tortoise9tech@gmail.com&id=3215292408776

                var mainUser = user;
                
                if(req.query.id == user.verification_code)
                {
                    User.update({ _id: user._id }, { $set: { status : true, verification_code : '' }}, function(err, user)
                    {
                        if (err)
                            res.send("<div style='text-align:center;'><h3>Email not verified. Please try again.</h3></div>");

                        req.login(mainUser, function (err)
                        {
                            if ( ! err )
                            {
                                res.redirect('/dashboard');
                            }
                            else
                            {
                                res.send("Something went wrong. Please try again." + err);
                            }
                        });
                    });
                }
                else
                {
                    res.send("<div style='text-align:center;'><h3>Bad Request or email already verified.</h3></div>");
                }
            }
            else
            {
                res.send("<div style='text-align:center;'><h3>Not valid user</h3></div>");
            }
        });
    });
    
    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function (req, res)
    {
        req.logout();
        return res.send({'status':'ok'});
    });
};

function isLoggedIn(req, res, next)
{
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}