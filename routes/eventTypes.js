const express = require('express')
const router = express.Router()
const Event = require('../models/event')
const User = require('../models/user')
const {requireAuth,checkUser, checkAdmin} = require('../middleware/authMiddleware')
const EventType = require('../models/eventType')
const moment = require('moment')

//all eventTypes Route
router.get('/',requireAuth, async (req, res) => {
    let searchOptions = {}
    if (req.query.name != null && req.query.name !== '') {
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try {
        const eventTypes = await EventType.find(searchOptions)
        res.render('eventTypes/index', {eventTypes: eventTypes,
        searchOptions: req.query})
    } catch(err) {
        console.log('err'+err)
        res.redirect('/')
    }
})


//new eventType Route
router.get('/new',checkAdmin, (req,res) => {
    res.render('eventTypes/new', { eventType: new EventType() })
})

//Create eventType Route
router.post('/',checkAdmin, async(req, res) =>{
    const eventType = new EventType({
        name: req.body.name
    })
try{
    const newType = await eventType.save()
    console.log(newType)
    res.redirect(`eventTypes/${newType.id}`)
} catch(err) {
    console.log('err'+err)
    res.render('eventTypes/new', {
        eventType: eventType,
        errorMessage: 'error creating Event Type'
    })
}
})

//get events by event type
router.get('/:id',requireAuth, async (req, res) =>{
    try {
        const eventType = await EventType.findById(req.params.id)
        const events = await Event.find({ eventType: eventType.id }).exec()
        res.render('eventTypes/show', {
            eventType: eventType,
            eventByType: events,
            moment: moment
        })
    } catch(err) {
        console.log('err'+err)
        res.redirect('/')
    }
})

//get edit event type
router.get('/:id/edit',checkAdmin, async (req, res) =>{
    try {
        const eventTypes = await EventType.findById(req.params.id)
        res.render('eventTypes/edit', {eventTypes: eventTypes})
    } catch(err) {
        console.log('err'+err)
        res.redirect('/eventTypes')
    }
})


//update event type
router.put('/:id',checkAdmin, async (req, res) =>{
    let eventTypes
    try{
        eventTypes = await EventType.findById(req.params.id)
        eventTypes.name = req.body.name
        await eventTypes.save()
        res.redirect(`/eventTypes/${eventTypes.id}`)
    } catch(err) {
        console.log('err'+err)
        if (eventTypes == null) {
            res.redirect('/')
        } else {
            res.render('eventTypes/edit',{
                eventTypes: eventTypes,
                errorMessage: 'Error updating event type'
            })
        }
    }
})

//delete event type
router.delete('/:id',checkAdmin, async (req, res) =>{
    let eventTypes
    try{
        eventTypes = await EventType.findById(req.params.id)
        await eventTypes.remove()
        res.redirect('/eventTypes')
    } catch(err) {
        console.log('err'+err)
        if (eventTypes == null) {
            res.redirect('/')
        } else {
            res.redirect(`eventTypes/${eventTypes.id}`)
        }
    }
})

module.exports = router