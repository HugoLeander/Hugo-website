const express = require('express')
const validators = require('../validations.js')
const db = require('../database.js')

const router = express.Router()

var csrf = require('csurf')
var csrfProtection = csrf({ cookie: true})




router.get('/', csrfProtection, function(request, response){
	db.getAllReviews(function(error, reviews){
		if(error){
			const model = {
				hasDatabaseError: true,
				reviews: [],
				csrfToken: request.csrfToken()
			}
			response.render('reviews.hbs', model)
		}else{
			const model = {
				hasDatabaseError: false,
				reviews,
				csrfToken: request.csrfToken()
			}
			response.render('reviews.hbs', model)
		}
	})
})

router.get('/create', csrfProtection, function(request, response){
	const model = {
		csrfToken: request.csrfToken()
	}
	response.render('create-review.hbs', model)
})

router.post('/create', csrfProtection, function(request, response){

	const name = request.body.name
	const rating = request.body.rating
	const description = request.body.description

	const errors = validators.getValidationErrorsForReviews(name, rating, description)

	if(errors.length == 0){		
		db.createReview(name, rating, description, function(error, reviewId){
			if(error){
				errors.push("Internal server error.")

				const model = {
					errors,
					name,
					rating,
					description,
					csrfToken: request.csrfToken()
				}
				response.render('create-review.hbs', model)
			}else{
				const id = this.lastID
				response.redirect('/reviews/'+reviewId)
			}
		})
	}else{
		const model = {
			errors,
			name,
			rating,
			description,
			csrfToken: request.csrfToken()
		}
		response.render('create-review.hbs', model)
	}
})

router.get('/:id', function(request, response){

	const id = request.params.id

	db.getReviewById(id, function(error, review){
		const model = {
            error,
			review
		}
		response.render('review.hbs', model)
	})
})

router.get('/:id/update', csrfProtection, function(request, response){
    
    const id = request.params.id

    db.getReviewById(id, function(error, review){
        const model = {
            error,
            review,
			csrfToken: request.csrfToken()
        }
        response.render('update-review.hbs', model)
    })
})

router.post('/:id/update', csrfProtection, function(request, response){

    const id = request.params.id
    const name = request.body.name
    const rating = request.body.rating
    const description = request.body.description

    const errors = validators.getValidationErrorsForReviews(name, rating, description)

    if(!request.session.isLoggedIn){
        errors.push("Not logged in")
    }

    if(errors.length == 0){
        db.updateReviewById(name, rating, description, id, function(error){
            if(error){
                errors.push("Internal server error")
                const model = {
                    errors,
                    name,
                    rating,
                    description,
					csrfToken: request.csrfToken()
                }
                response.render('update-review.hbs', model)
            }else{
                response.redirect('/reviews/'+id)
            }
        })

    }else{
        const model = {
            errors,
            review: {
            name,
            rating,
            description,
			csrfToken: request.csrfToken()
            }
        }
        response.render('update-review.hbs', model)
    }
})


router.get('/:id/delete', function(request, response){
	
	const id = request.params.id
	
	db.getReviewById(id, function(error, review){
		const model = {
            error,
			review
		}
		response.render('delete-review.hbs', model)		
	})	
})

router.post('/:id/delete', function(request, response){
	
	const id = request.params.id
	const errors=[];
    
	if(!request.session.isLoggedIn){
		errors.push("You are not logged in.")
	}
	
	if(errors.length == 0){		
		db.deleteReviewById(id, function(error){
            if(error){
                errors.push("Internal server error")

                const model = {
                    errors,
                    review
                }
                response.render('delete-review.hbs', model)
            }else{
			response.redirect('/reviews')
            }
		})

	}else{
		const model = {
			errors,
			review
		}
		response.render('delete-review.hbs', model)
	}
})


module.exports = router