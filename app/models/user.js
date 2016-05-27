var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

// set up a mongoose model
var UserSchema = new Schema({
    first_name : {
        type: String
    },
    last_name : {
        type: String
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date_of_birth : {
        type : Date
    },
    role : {
        type : String
    },
    status : {
        type : Boolean,
        default : false
    },
    verification_code : {
        type : String
    },
    created_at    : {
        type: Date,
        required: true,
        default: Date.now
    }
});

UserSchema.methods.generateHash = function(password)
{
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UserSchema.methods.validPassword = function(password)
{
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);