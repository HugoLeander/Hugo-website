const express = require('express')
const expressHandlebars = require('express-handlebars')
const expressSession = require('express-session')

const connectSqlite3 = require('connect-sqlite3')
const SQLiteStore = connectSqlite3(expressSession)

var cookieParser = require("cookie-parser")

const path = require('path')

const app = express()

app.use(express.static('public'))

app.use(cookieParser('vwevwvsnertkmtya'))

app.use(express.static(path.join(__dirname, 'images')))

app.use(express.urlencoded({
	extended: false
}))

const oneHour = 1000 * 60 * 60 // you need to enter the time in milliseconds and 60*60*1000 = 3 600 000 milliseconds and that equals to 1 hour.
app.use(expressSession({
	secret: "dhjikwedgh",
	saveUninitialized: false,
	resave: false,
	cookie: { maxAge: oneHour },
	store: new SQLiteStore({ db: 'hugo-leander.db' })
}))

const loginRouter = require('./routers/login-router.js')
const productRouter = require('./routers/product-router.js')
const FAQRouter = require('./routers/FAQ-router.js')
const reviewRouter = require('./routers/review-router.js')

app.use(function (request, response, next) {
	//Makes the session available to all views.
	response.locals.session = request.session
	next()
})

app.engine('hbs', expressHandlebars({
	defaultLayout: 'main.hbs'
}))

app.use('/products', productRouter)
app.use('/FAQ', FAQRouter)
app.use('/login', loginRouter)
app.use('/reviews', reviewRouter)

app.get('/', function (request, response) {
	response.render('start.hbs')
})

app.get('/about', function (request, response) {
	response.render('about.hbs')
})

app.get('/contact', function (request, response) {
	response.render('contact.hbs')
})

app.post('/log-out', async function (request, response) {
	request.session.isLoggedIn = false
	response.redirect('/')
})

app.listen(8080)