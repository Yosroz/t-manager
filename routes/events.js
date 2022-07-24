const { Router } = require('express');
const {requireAuth, checkUser} = require('../middleware/authMiddleware')
const Event = require('../models/event')
const User = require('../models/User')
const EventType = require('../models/eventType')

const router = Router();

// All Event Route
router.get('/',requireAuth, async (req, res) => {
    let query = Event.find()
    if (req.query.eventName != null && req.query.eventName != '') {
        query = query.regex('eventName', new RegExp(req.query.eventName,'i'))
    }
    if (req.query.eventBefore != null && req.query.eventBefore != '') {
        query = query.lte('eventDate',req.query.eventBefore)
    }
    if (req.query.eventAfter != null && req.query.eventAfter != '') {
        query = query.gte('eventDate', req.query.eventAfter)
    }
    try {
        const events = await query.exec()
        res.render('events/index', {
            events: events,
            searchOptions: req.query
        })
    } catch(err) {
        console.log('err'+err)
        res.redirect('/')
    }
})

// New Event Route
router.get('/new',requireAuth, async (req, res) => {
    renderNewpage(res, new Event())
        }
)

// Create Event Route
router.post('/',checkUser, async (req, res) => {
    const event = new Event({
        eventName: req.body.eventName,
        host: req.body.host,
        eventType: req.body.eventType.trim(),
        eventDate: new Date(req.body.eventDate),
        eventLocation: req.body.eventLocation,
        description: req.body.description
    })
    try{
        const newEvent = await event.save()
        //res.redirect(`events/${newEvent.id}`)
        res.redirect('events')
    } catch(err) {
        console.log('err'+err)
    }
})

async function renderNewpage(res, event, hasError = false) {
    try {
        const eventTypes = await EventType.find({})
        const params = {
            eventTypes: eventTypes,
            event: event
        }
        if (hasError) params.errorMessage = 'Error creating event'
        res.render('events/new', params)
    } catch(err) {
        console.log('err' + err)
        res.redirect('/events')
    }
}


module.exports = router;