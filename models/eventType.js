const mongoose = require('mongoose')


const eventTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
})


module.exports = mongoose.model('EventType',eventTypeSchema)