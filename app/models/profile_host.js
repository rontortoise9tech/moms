var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
var profileSchema = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    member : {
        type : Array
    },
    experience_desc : {
        type: String,
        trim: true
    },
    country : {
        type: String,
        trim: true
    },
    city : {
        type: String,
        trim: true
    },
    language : {
        type: String,
        trim: true
    },
    amenities : {
        type: String,
        trim: true
    },
    facility_desc : {
        type: String,
        trim: true
    },
    photos : {
        type : Array
    },
    surrounding_desc : {
        type: String,
        trim: true
    },
    created_at : {
        type: Date,
        required: true,
        default: Date.now
    }
});

module.exports = mongoose.model('ProfileHost', profileSchema);