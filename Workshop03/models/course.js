const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    credits: {
        required: true,
        type: Number
    },
    code: {
        required: true,
        type: Number
    },
    description: {
        required: true,
        type: String
    },
    teacherId: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher'
    }
})

module.exports = mongoose.model('Course', courseSchema)