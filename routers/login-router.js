const express = require('express')
const validators = require('../validations.js')
const bcrypt = require('bcryptjs');
const { route } = require('./product-router.js');
const sqlite3 = require('sqlite3');

const db = new sqlite3.Database('hugo-leander.db')

var csrf = require('csurf')
var csrfProtection = csrf({ cookie: true })


const router = express.Router()

const ADMIN_USERNAME = 'Hugo'
const ADMIN_PASSWORD = 'abc123'

async function storeAccount() {
	try {
		const hash = await bcrypt.hash(ADMIN_PASSWORD, 10)
		const query = "INSERT INTO users (username, password) VALUES (?, ?)"
		const values = [ADMIN_USERNAME, hash]
		db.run(query, values, function (error) {
			if (error) {
				console.log("skapar admin")
			}
		})
	} catch (e) {
		console.log("något gick fel i catch")
	}
}

storeAccount();

router.get('/', csrfProtection, function (request, response) {
	const model = {
		csrfToken: request.csrfToken()
	}
	response.render('login.hbs', model);
})


router.post('/', csrfProtection, async function (request, response) {
	try {
		const username = request.body.username
		const password = request.body.password
		const errors = []

		db.get("SELECT * FROM users WHERE username = ?", username, async function (error, user) {
			if (user) {
				const validPassword = await bcrypt.compare(password, user.password)
				if (validPassword) {
					request.session.isLoggedIn = true
					response.redirect('/')
				} else {
					errors.push("Wrong Password")
					const model = {
						errors,
						username,
						csrfToken: request.csrfToken()
					}
					response.render('login.hbs', model)
				}
			} else {
				errors.push('Username does not exist')
				const model = {
					errors,
					username,
					csrfToken: request.csrfToken()
				}
				response.render('login.hbs', model)
			}
		})
	} catch (e) {
		console.log("Något gick fel")
	}
})


module.exports = router;