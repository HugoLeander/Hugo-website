const express = require('express')
const expressHandlebars = require('express-handlebars')
const expressSession = require('express-session')
//var { randomBytes } = require('crypto');

const connectSqlite3 = require('connect-sqlite3')
const SQLiteStore = connectSqlite3(expressSession)
const sqlite3 = require('sqlite3')
const db = new sqlite3.Database('C:\Users\hugol\onedrive\programmering\web\project\hugo-leander.db')


var cookieParser = require("cookie-parser");
var csrf = require('csurf')
var csrfProtection = csrf({ cookie: true})

const path = require('path')

const app = express()

app.use(express.static('public'))

app.use(cookieParser('vwevwvsnertkmtya'));

app.use(express.static(path.join(__dirname, 'images')))

app.use(express.urlencoded({
	extended: false
}))

const oneHour = 1000 * 60 * 60;
app.use(expressSession({
	secret: "dhjikwedgh",
	saveUninitialized: false,
	resave: false,
	cookie: {maxAge: oneHour},
	store: new SQLiteStore({db: 'C:\Users\hugol\onedrive\programmering\web\project\hugo-leander.db'})
}));
////////////////////////////////////////////////////////////////////////////////////
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
app.use('/auth', loginRouter)
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

app.get('/logout', function(request, response){
	request.session.isLoggedIn = false
	response.render('start.hbs')
})
app.listen(8080)