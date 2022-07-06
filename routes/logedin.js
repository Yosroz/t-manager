const express = require('express')
const router = express.Router()
const {requireAuth} = require('../middleware/authMiddleware')

router.get('/logedin', requireAuth, (req, res) => {
    res.render('logedin')
})

module.exports = router
