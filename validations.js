const productRouter = require("./routers/product-router")
const loginRouter = require("./routers/login-router")
const faqRouter = require("./routers/FAQ-router")
const reviewRouter = require("./routers/review-router")

const ADMIN_USERNAME = 'Hugo'
const ADMIN_PASSWORD = 'abc123'

const MIN_NAME_LENGTH = 3
const MIN_DESCRIPTION_LENGTH = 5



exports.getValidationErrorsForProduct = function(name, description){

	const validationErrors = []

	if (name.length < MIN_NAME_LENGTH) {
		validationErrors.push("The name needs to be at least " + MIN_NAME_LENGTH + " characters.")
	}

	if (description.length < MIN_DESCRIPTION_LENGTH) {
		validationErrors.push("The description needs to be at least " + MIN_DESCRIPTION_LENGTH + " characters.")
	}

	return validationErrors
}

exports.getValidationErrorsForLogin = function(username, password) {

	const loginErrors = []

	if (username != ADMIN_USERNAME) {
		loginErrors.push("Wrong username or password")
	}

	if (password != ADMIN_PASSWORD) {
		loginErrors.push("Wrong username or password")
	}

	return loginErrors

}


exports.getValidationErrorsForFAQ = function(question, answer){
	const faqErrors = []

	if(question.length < MIN_NAME_LENGTH){
		faqErrors.push("The name needs to be at least "+MIN_NAME_LENGTH+" characters.")
	}
	
	if(answer.length < MIN_DESCRIPTION_LENGTH){
		faqErrors.push("The description needs to be at least "+MIN_DESCRIPTION_LENGTH+" characters.")
	}
	
	return faqErrors
	
}


exports.getValidationErrorsForReviews = function (name, rating, description){
	const reviewsError = []

	if(name.length < MIN_NAME_LENGTH){
		reviewsError.push("The name needs to be at least "+MIN_NAME_LENGTH+" characters.")
	}
	if(rating > 5 || rating < 1 ){
		reviewsError.push("The rating is out of range.")
	}
	if(description.length < MIN_DESCRIPTION_LENGTH){
		reviewsError.push("The description needs to be at least "+MIN_DESCRIPTION_LENGTH+" characters.")
	}
	return reviewsError
}


module.exports = faqRouter
module.exports = productRouter
module.exports = loginRouter
module.exports = reviewRouter





