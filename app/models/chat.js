var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
var ChatSchema = new Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    to : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    msg : {
      type : String,
      trim : true
    },
    status : {
        type : Boolean,
        default : true
    },
    created_at    : {
        type: Date,
        required: true,
        default: Date.now
    }
});

module.exports = mongoose.model('Chat', ChatSchema);