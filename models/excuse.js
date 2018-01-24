let mongoose = require('mongoose');

let excuseSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    body: {
        type: String,
        required: true
    }
});

let Excuse = module.exports = mongoose.model('Excuse', excuseSchema);