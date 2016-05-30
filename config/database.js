var path = require('path');
var rootPath = path.normalize(__dirname + '/../');

module.exports = {
    "development" : {
        url: 'mongodb://localhost/moms',
//        url: 'mongodb://tortoise9tech:tortoise9tech123@ds023452.mlab.com:23452/moms',
        rootPath: rootPath,
        port: process.env.PORT || 9090,
        secretKey : "asd4a6sd4as8d46243412834as45das54d@!@#a5d4a56sd4",
        accessKeyId: "AKIAJXPGZQN7PVJUU7UA",
        secretAccessKey: "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",
        bucketName: 'momshostpictures'
    },
    "production" : {
        url: 'mongodb://tortoise9tech:tortoise9tech123@ds023452.mlab.com:23452/moms',
        rootPath: rootPath,
        port: process.env.PORT || 80,
        secretKey : "asd4a6sd4as8d46243412834as45das54d@!@#a5d4a56sd4",
        accessKeyId: "AKIAJXPGZQN7PVJUU7UA",
        secretAccessKey: "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",
        bucketName: 'momshostpictures'
    },
    "heroku" : {
        'url': 'mongodb://tortoise9tech:tortoise9tech123@ds023452.mlab.com:23452/moms',
        rootPath: rootPath,
        port: process.env.PORT || 80,
        secretKey : "asd4a6sd4as8d46243412834as45das54d@!@#a5d4a56sd4",
        accessKeyId: "AKIAJXPGZQN7PVJUU7UA",
        secretAccessKey: "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",
        bucketName: 'momshostpictures'
    },
    "cleverCloud" : {
        'url': 'mongodb://uszayc877sbdjps:ZEgyxD0NXxa92xknpOqR@bwyhbbvwruzrile-mongodb.services.clever-cloud.com:27017/bwyhbbvwruzrile',
        rootPath: rootPath,
        port: process.env.PORT || 80,
        secretKey : "asd4a6sd4as8d46243412834as45das54d@!@#a5d4a56sd4",
        accessKeyId: "AKIAJXPGZQN7PVJUU7UA",
        secretAccessKey: "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",
        bucketName: 'momshostpictures'
    }
};