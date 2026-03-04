const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    lastname: {
        required: true,
        type: String
    },
    age: {
        required: true,
        type: Number
    },
    cedula: {
        required: true,
        type: String
    }
})

module.exports = mongoose.model('Teacher', teacherSchema)