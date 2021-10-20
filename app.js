const express = require('express')
const expressHandlebars = require('express-handlebars')
const expressSession = require('express-session')
//const { uptime } = require('process')
const connectSqlite3 = require('connect-sqlite3')
const SQLiteStore = connectSqlite3(expressSession)
const path = require('path')
const bcrypt = require('bcryptjs');

const sqlite3 = require('sqlite3')
//const { response } = require('express')
const db = new sqlite3.Database('C:\Users\hugol\onedrive\programmering\web\project\hugo-leander.db')


const app = express()

app.use(express.static('public'))

app.use(express.static(path.join(__dirname, 'images')))

app.use(express.urlencoded({
	extended: false
}))

app.use(expressSession({
	secret: "dhjikwedgh",
	saveUninitialized: false,
	resave: false,
	//store: new SQLiteStore({db: 'C:\Users\hugol\onedrive\programmering\web\project\hugo-leander.db'})
}));
////////////////////////////////////////////////////////////////////////////////////
const loginRouter = require('./routers/login-router.js')
const productRouter = require('./routers/product-router.js')
const FAQRouter = require('./routers/FAQ-router.js')
const reviewRouter = require('./routers/review-router.js')

app.use('/products', productRouter)
app.use('/FAQ', FAQRouter)
app.use('/login', loginRouter)
app.use('/reviews', reviewRouter)

app.use(function (request, response, next) {
	//Makes the session available to all views.
	response.locals.session = request.session
	next()
})

app.engine('hbs', expressHandlebars({
	defaultLayout: 'main.hbs'
}))

app.get('/', function (request, response) {
	response.render('start.hbs')
})

app.get('/about', function (request, response) {
	response.render('about.hbs')
})

app.get('/contact', function (request, response) {
	response.render('contact.hbs')
})

app.get('/sign-up', function (request, response) { // anatagligen ta bort sen
	response.render('sign-up.hbs')
})


app.listen(8080)