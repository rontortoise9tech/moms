var LocalStrategy = require('passport-local').Strategy;
var User = require('../app/models/user');
var nodemailer = require("nodemailer");

module.exports = function (passport) {

    passport.serializeUser(function (user, done)
    {
        done(null, user);
    });

    passport.deserializeUser(function (id, done)
    {
        User.findById(id._id, function (err, user)
        {
            done(err, user);
        });
    });

    passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    function (req, email, password, done)
    {
        User.findOne({'email': email, 'status': true}, function (err, user)
        {
            if (err)
                return done(err);

            if (!user)
                return done(null, false, req.flash('loginMessage', 'No user found.'));

            if (!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));

            return done(null, user);
        });
    }));

    passport.use('local-signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    function (req, email, password, done)
    {
        process.nextTick(function ()
        {
            User.findOne({'email': req.body.email}, function (err, user)
            {
                if (err)
                    return done(err);

                if (user)
                {
                    return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                }
                else
                {
                    var smtpTransport = nodemailer.createTransport("SMTP",
                    {
                        service: 'Gmail',
                        auth: {
                            user: "rontortoise9tech@gmail.com",
                            pass: "rontortoise9tech@123"
                        },
                        logger: false,
                        debug: true
                    }, {
                        from: 'MOMs <noreply@moms.com>'
                    });
                    
                    var rand, mailOptions, host, link;

                    rand = Math.floor((Math.random() * 987456321) + 3214566987546);
                    host = req.get('host');

                    link = "http://" + req.get('host') + "/verify?id=" + rand + "&email="+req.body.email;

                    mailOptions = {
                        to: req.body.email,
                        subject: "Please confirm your Email account",
                        html: "Hello,<br> Please Click on the link to verify your email.<br><a href=" + link + ">Click here to verify</a>"
                    }

                    smtpTransport.sendMail(mailOptions, function (error, response)
                    {
                        if (error)
                        {
                            console.log(error);
                            return done(error);
                        }
                        else
                        {
                            console.log("Message sent: " + response.message);
                            
                            var newUser = new User();

                            newUser.email = req.body.email;
                            newUser.password = newUser.generateHash(req.body.password);
                            newUser.first_name = req.body.first_name;
                            newUser.last_name = req.body.last_name;
                            newUser.date_of_birth = req.body.date_of_birth;
                            newUser.role = req.body.role;
                            newUser.verification_code = rand;

                            newUser.save(function (err)
                            {
                                if (err)
                                    throw err;
                                else
                                    return done(null, newUser);
                            });
                        }
                    });
                }
            });
        });
    }));
};