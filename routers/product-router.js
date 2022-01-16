const express = require('express')
const validators = require('../validations.js')
const db = require('../database.js')
const router = express.Router()

var csrf = require('csurf')
var csrfProtection = csrf({ cookie: true })

router.get('/', csrfProtection, function (request, response) {
	db.getAllproducts(function (error, products) {
		if (error) {
			const model = {
				hasDatabaseError: true,
				products: [],
				csrfToken: request.csrfToken()
			}
			response.render('products.hbs', model)
		}
		else {
			const model = {
				hasDatabaseError: false,
				products,
				csrfToken: request.csrfToken()
			}
			response.render('products.hbs', model)
		}
	})
})

router.get('/create', csrfProtection, function (request, response) {
	const model = {
		csrfToken: request.csrfToken()
	}
	response.render('create-product.hbs', model)
})

router.post('/create', csrfProtection, function (request, response) {

	const name = request.body.name
	const description = request.body.description

	const errors = validators.getValidationErrorsForProduct(name, description)

	if (!request.session.isLoggedIn) {
		errors.push("You are not logged in.")
	}

	if (errors.length == 0) {
		db.createProduct(name, description, function (error, productId) {
			if (error) {

				errors.push("Internal server error")
				const model = {
					errors,
					name,
					description,
					csrfToken: request.csrfToken()
				}
				response.render('create-product.hbs', model)
			} else {

				response.redirect('/products/' + productId)
			}
		})

	} else {
		const model = {
			errors,
			name,
			description,
			csrfToken: request.csrfToken()
		}
		response.render('create-product.hbs', model)
	}
})

router.get('/:id', function (request, response) {
	const id = request.params.id

	db.getProductById(id, function (error, product) {
		const model = {
			error,
			product
		}
		response.render('product.hbs', model)
	})

})

router.get('/:id/update', csrfProtection, function (request, response) {

	const id = request.params.id

	db.getProductById(id, function (error, product) {
		const model = {
			error,
			product,
			csrfToken: request.csrfToken()
		}
		response.render('update-product.hbs', model)
	})
})

router.post('/:id/update', csrfProtection, function (request, response) {

	const id = request.params.id
	const name = request.body.name
	const description = request.body.description

	const errors = validators.getValidationErrorsForProduct(name, description)

	if (!request.session.isLoggedIn) {
		errors.push("Not logged in.")
	}
	if (errors.length == 0) {

		db.updateProductById(id, name, description, function (error) {
			if (error) {
				errors.push("Internal server error")
				const model = {
					errors,
					name,
					description,
					csrfToken: request.csrfToken()
				}
				response.render('update-product.hbs', model)
			} else {
				response.redirect('/products/' + id)
			}
		})
	} else {
		const model = {
			errors,
			product: {
				id,
				name,
				description,
				csrfToken: request.csrfToken()
			}
		}
		response.render('update-product.hbs', model)
	}

})

router.get('/:id/delete', function (request, response) {

	const id = request.params.id

	db.getProductById(id, function (error, product) {
		const model = {
			error,
			product
		}
		response.render('delete-product.hbs', model)
	})
})

router.post('/:id/delete', function (request, response) {

	const id = request.params.id
	const errors = []

	if (!request.session.isLoggedIn) {
		errors.push("Not logged in")
	}
	if (errors.length == 0) {
		db.deleteProductById(id, function (error) {
			if (error) {
				errors.push("Internal server error")

				const model = {
					errors,
					id
				}
				response.render('delete-product.hbs', model) // kanske lägga till model
			} else {

				response.redirect('/products')
			}
		})
	} else {
		const model = {
			errors,
		}
		response.render('delete-product.hbs', model)
	}
})

module.exports = router