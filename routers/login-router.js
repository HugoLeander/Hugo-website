const express = require('express')
const validators = require('../validations.js')
const { response } = require('express')
const bcrypt = require('bcryptjs');
const db = require('../database.js');
const { route } = require('./product-router.js');

const router = express.Router()

const ADMIN_USERNAME = 'Hugo'
const ADMIN_PASSWORD = 'abc123'


router.get('/', function (request, response) {
	response.render('login.hbs')
})

router.post('/', function (request, response) {

	const username = request.body.username
	const password = request.body.password

	const errors = []
	//TODO: dont use hardcoded values

	if (username == ADMIN_USERNAME && password == ADMIN_PASSWORD) {
		request.session.isLoggedIn = true
		response.redirect('/products')
	} else {

		if (username != ADMIN_USERNAME) {
			errors.push("Wrong Username")
			const model = {
				errors,
				username
			}
			response.render('login.hbs', model)
		}

		if (username == ADMIN_USERNAME && password != ADMIN_PASSWORD) {
			errors.push("Wrong Password")
			const model = {
				errors,
				username
			}
			response.render('login.hbs', model)
		}

	}

})


module.exports = router;