const mongoose = require('mongoose')
const { isEmail } = require('validator')
const bcrypt = require('bcrypt')


const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  eventDate: {
    type: Date,
    required: true
  },
  eventLocation: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    //required: true,
    ref: 'user',
    //add default to current user
  }
})


const User = mongoose.model('event', eventSchema)

module.exports = Event