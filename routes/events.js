const { Router } = require('express');
const {requireAuth} = require('../middleware/authMiddleware')
const event = require('../models/event')
const user = require('../models/User')

const router = Router();

// All Event Route
router.get('/',async (req, res) => {
    res.render('logedin')
})

// New Event Route
router.get('/new',async (req, res) => {
    res.render('events/new')
        }
)

// Create Event Route
router.post('/',async (req, res) => {
    res.send('Create Event')
})


module.exports = router;