var path = require('path');
var rootPath = path.normalize(__dirname + '/../');

module.exports = {
    "development" : {
//        url: 'mongodb://localhost/moms',
        url: 'mongodb://tortoise9tech:tortoise9tech123@ds023452.mlab.com:23452/moms',
        rootPath: rootPath,
        port: process.env.PORT || 9090,
        secretKey : "asd4a6sd4as8d46243412834as45das54d@!@#a5d4a56sd4"
    },
    "production" : {
        url: 'mongodb://tortoise9tech:tortoise9tech123@ds023452.mlab.com:23452/moms',
        rootPath: rootPath,
        port: process.env.PORT || 80,
        secretKey : "asd4a6sd4as8d46243412834as45das54d@!@#a5d4a56sd4"
    },
    "heroku" : {
        'url': 'mongodb://tortoise9tech:tortoise9tech123@ds023452.mlab.com:23452/moms',
        rootPath: rootPath,
        port: process.env.PORT || 80,
        secretKey : "asd4a6sd4as8d46243412834as45das54d@!@#a5d4a56sd4"
    }
};