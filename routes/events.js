const { Router } = require('express');
const Event = require('../models/event')
const User = require('../models/user')
const EventType = require('../models/eventType');
const {requireAuth,checkUser, checkAdmin} = require('../middleware/authMiddleware')
const { render } = require('ejs');
const moment = require('moment')

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
            searchOptions: req.query,
            moment: moment,
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

// show event
router.get('/:id',requireAuth, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
        const eventType = await EventType.findById(event.eventType).exec()
        console.log(eventType)
        res.render('events/show', {
            event: event,
            eventType: eventType,
            moment: moment
        })
    } catch(err) {
        console.log('err'+err)
        res.redirect('/')
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

//get edit event
router.get('/:id/edit',checkAdmin, async (req, res) =>{
    try {
        const event = await Event.findById(req.params.id)
        res.render('events/edit', {event: event})
    } catch(err) {
        console.log('err'+err)
        res.redirect('/events')
    }
})


//update event 
router.put('/:id',checkAdmin, async (req, res) =>{
    let event
    try{
        event = await Event.findById(req.params.id)
        event.Eventname = req.body.name
        await event.save()
        res.redirect(`/events/${event.id}`)
    } catch(err) {
        console.log('err'+err)
        if (event == null) {
            res.redirect('/')
        } else {
            res.render('events/edit',{
                event: event,
                errorMessage: 'Error updating event'
            })
        }
    }
})

//delete event 
router.get('/:id/delete',checkAdmin, async (req, res) =>{
    let event
    try{
        event = await Event.findById(req.params.id)
        await event.remove()
        res.redirect('/events')
    } catch(err) {
        console.log('err'+err)
        if (event == null) {
            res.redirect('/')
        } else {
            res.redirect(`events/${event.id}`)
        }
    }
})

module.exports = router;