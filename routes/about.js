const express = require('express')
const router = express.Router()

const { requireAuth, checkUser } = require('../middleware/authMiddleware')

router.get('*', checkUser)

router.get('/', (req, res) => {
    res.render('about/about.ejs')
})

module.exports = router
