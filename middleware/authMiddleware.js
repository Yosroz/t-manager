const jwt = require('jsonwebtoken')
const User = require('../models/user')

const requireAuth = (req, res, next) => {
    const token =  req.cookies.jwt

    // check json web token exists & verified
    if (token) {
        jwt.verify(token, 'tmanager secret', (err, decodedToken) =>{
            if(err) {
                console.log(err.message)
                res.redirect('/login')
            } else {
                //console.log(decodedToken)
                next()
            }
        })
    }
    else {
        res.redirect('/login')
    }
}

// check current user
const checkUser = (req, res, next) => {
    const token = req.cookies.jwt

    if (token) {
        jwt.verify(token, 'tmanager secret', async (err, decodedToken) =>{
            if(err) {
                console.log(err.message)
                res.locals.user = null
                next()
            } else {
                //console.log(decodedToken)
                let user = await User.findById(decodedToken.id)
                res.locals.user = user
                next()
            }
        })
    }
    else {
        res.locals.user = null
        next()
    }
}

const checkAdmin = (req, res, next) => {
    const token = req.cookies.jwt

    if(token) {
        jwt.verify(token, 'tmanager secret', async (err, decodedToken) =>{
            if(err) {
                console.log(err.message)
                res.locals.user = null
                next()
            } else {
                //console.log(decodedToken)
                let user = await User.findById(decodedToken.id)
                if(user.isAdmin) {
                    res.locals.user = user
                    next()
                } else {
                    console.log('not admin')
                    res.redirect('/')
                }
            }
        })
    }  
    else {
        res.locals.user = null
        next()
    }
}

module.exports = { requireAuth, checkUser, checkAdmin }