if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const { requireAuth, checkUser } = require('./middleware/authMiddleware')
const methodOverride = require('method-override')

const indexRouter = require('./routes/index')
const authRouter = require('./routes/authRoutes')
const eventRouter = require('./routes/events')
const eventTypeRouter = require('./routes/eventTypes')
const logedinRouter = require('./routes/logedin')

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true })
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.error('Conneced to Mongoose'))

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')

app.use(expressLayouts)
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({limit: '10mb',extended: false}))

app.use('/', indexRouter)
app.use('/events', eventRouter)
app.use('/eventTypes', eventTypeRouter)
app.use(authRouter)
app.use(logedinRouter)


app.listen(process.env.PORT || 3000)