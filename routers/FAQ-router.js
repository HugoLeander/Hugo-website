const express = require('express')
const validators = require('../validations.js')
const db = require('../database.js')

const router = express.Router()

router.get('/', function(request, response){
    db.getAllFAQs(function(error, faqs){
        if(error){
            const model = {
                hasDatabaseError: true,
                faqs: []
            }
            response.render('FAQ.hbs', model)
        }
        else{
            const model = {
                hasDatabaseError: false,
                faqs
            }
            response.render('FAQ.hbs', model)
        }
    })
})

router.get('/create', function(request, response){
    response.render('create-FAQ.hbs')
})

router.post('/create', function(request, response){

    const question = request.body.question
    const answer = request.body.answer

    const errors = validators.getValidationErrorsForFAQ(question, answer)

    if (!request.session.isLoggedIn) {
		errors.push("You are not logged in.")
	}
    if(errors.length == 0){
        db.createFAQ(question, answer, function(error, FAQId){
            if(error){
                errors.push("Internal server error")
                const model = {
                    errors,
                    question,
                    answer
                }
                response.render('create-FAQ.hbs', model)
            }else{
                response.redirect('/FAQ/'+FAQId)
            }
        })

    }else{
        const model = {
            errors,
            question,
            answer
        }
        response.render('create-FAQ.hbs', model)
    }
})

router.get('/:id', function(request, response){
    const id = request.params.id

    db.getFAQById(id, function(error, faq){
        const model = {
            error,
            faq
        }
        response.render('single-faq.hbs', model)
    })
})

router.get('/:id/update', function(request, response){
    
    const id = request.params.id

    db.getFAQById(id, function(error, faq){
        const model = {
            error,
            faq
        }
        response.render('update-faq.hbs', model)
    })
})

router.post('/:id/update', function(request, response){

    const id = request.params.id
    const question = request.body.question
    const answer = request.body.answer

    const errors = validators.getValidationErrorsForFAQ(question, answer)

    if(!request.session.isLoggedIn){
		errors.push("Not logged in.")
	}
    if(errors.length == 0){

        db.updateFAQById(id, question, answer, function(error){
            if(error){
                errors.push("Internal server error")
                const model = {
                    errors,
                    question,
                    answer
                }
                response.render('update-faq.hbs', model)
            }else{
                response.redirect('/FAQ/'+id)
            }
        })
    }else{
        const model = {
            errors,
            faq: {
                id,
                question,
                answer
            }
        }
        response.render('update-faq.hbs', model)
    }

})

router.get('/:id/delete', function(request, response){

    const id = request.params.id

    db.getFAQById(id, function(error, faq){
        const model = {
            error,
            faq
        }
        response.render('delete-faq.hbs', model)
    })
})

router.post('/:id/delete', function(request, response){

    const id = request.params.id
    const errors = []
    
    if(!request.session.isLoggedIn){
        errors.push("Not logged in")
    }
    if(errors.length == 0){
        db.deleteFAQById(id, function(error){
            if(error){
                errors.push("Internal server error")

                const model = {
                    errors,
                    faq
                }
                response.render('delete-faq.hbs', model)
            }else{
                response.redirect('/FAQ')
            }
        })
    }
})

module.exports = router