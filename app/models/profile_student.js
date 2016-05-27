var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
var profileStudentSchema = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    first_name : {
        type: String,
        trim: true
    },
    last_name : {
        type: String,
        trim: true
    },
    gender : {
        type: String,
        trim: true
    },
    photos : {
        type : String,
        trim: true
    },
    date_of_birth : {
        type: Date
    },
    phone_number : {
        type: String,
        trim: true
    },
    education_place : {
        type: String,
        trim: true
    },
    country_of_interest : {
        type: Array
    },
    city_of_interest : {
        type: Array
    },
    field_of_interest : {
        type: Array
    },
    check_in : {
        type: Date
    },
    check_out : {
        type: Date
    },
    languages : {
        type: String,
        trim : true
    },
    look_up : {
        type: String,
        trim : true
    },
    created_at : {
        type: Date,
        required: true,
        default: Date.now
    }
});

module.exports = mongoose.model('ProfileStudent', profileStudentSchema);