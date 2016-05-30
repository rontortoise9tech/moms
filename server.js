// server.js

// set up ======================================================================
var express = require('express');
var app = express();
var http = require('http');

var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var path = require("path");

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('./config/database.js')[env];

// configuration ===============================================================
mongoose.connect(config.url);

mongoose.connection.on('connecting', function()
{
    console.info("trying to establish a connection to mongo");
});

mongoose.connection.on('connected', function()
{
    console.info("connection established successfully");
});

mongoose.connection.on('error', function(err)
{
    console.error('connection to mongo failed ' + err);
});

require('./config/passport')(passport);

app.use(morgan('dev'));

var jsonParser       = bodyParser.json({limit:1024*1024*20, type:'application/json'});
var urlencodedParser = bodyParser.urlencoded({ extended:true,limit:1024*1024*20,type:'application/x-www-form-urlencoding' })

app.use(jsonParser);
app.use(urlencodedParser);

app.use(cookieParser());
app.use(bodyParser());

app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

app.set('views', path.join(__dirname, 'public/partials/'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({secret: config.secretKey}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


app.all('*', function (req, res, next)
{
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
    if (req.method == 'OPTIONS') {
        res.status(200).end();
    } else {
        next();
    }
});

require('./app/routes.js')(app, passport);
require("./app/routers/profile")(app,config);
require("./app/routers/applications")(app);
require("./app/routers/chat")(app);

app.use(function(req, res) {
    res.sendfile(__dirname + '/public/index.html');
});


var server = http.createServer(app);

var io = require('socket.io').listen(server);

server.listen(config.port);

require("./config/socket")(io);

//app.listen(config.port);
console.log('The magic happens on port ' + config.port);


//var io = require('socket.io')();
//io.on('connection', function(socket){});
//io.listen(config.port);
