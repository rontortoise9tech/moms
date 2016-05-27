var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
var applicationsSchema = new Schema({
    student_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    host_id : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status : {
        type : Boolean,
        default : true
    },
    created_at : {
        type: Date,
        required: true,
        default: Date.now
    }
});

module.exports = mongoose.model('Applications', applicationsSchema);