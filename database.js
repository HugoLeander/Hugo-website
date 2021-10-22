const sqlite3 = require('sqlite3')
const db = new sqlite3.Database('C:\Users\hugol\onedrive\programmering\web\project\hugo-leander.db')



db.run(`
	CREATE TABLE IF NOT EXISTS products (
		id  INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT,
		description TEXT
	)
`)

db.run(`
	CREATE TABLE IF NOT EXISTS reviews(
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT,
		rating TEXT,
		description TEXT
	)
`)

db.run(`
	CREATE TABLE IF NOT EXISTS faqs(
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		question TEXT,
		answer TEXT
	)
`)

db.run(`
	CREATE TABLE IF NOT EXISTS users(
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		username TEXT UNIQUE,
		password TEXT
	)
`)

exports.getAllproducts = function(callback){
    const query = "SELECT * FROM products"
    db.all(query,function(error, products){
        callback(error, products)
    })
}

exports.createProduct = function(name, description, callback){

    const query = "INSERT INTO products (name, description) VALUES (?, ?)"
    const values = [name, description]

    db.run(query, values, function(error){
        callback(error, this.lastID)
    })
}

exports.getProductById = function(id, callback){

    const query = "SELECT * FROM products WHERE id = ? LIMIT 1"
	const values = [id]

    db.get(query, values, function(error, product){
        callback(error, product)
    })
}

exports.updateProductById = function(id, name, description, callback){
    const query = "UPDATE products SET name = ?, description = ? WHERE id = ?"
    const values = [name, description, id]

    db.run(query, values, function(error){
        callback(error)
    })
}

exports.deleteProductById = function(id, callback){

    const query = "DELETE FROM products WHERE id = ?"
    const values = [id]

    db.run(query, values, function(error){
        callback(error)
    })
}

exports.getAllFAQs = function(callback){
    const query = "SELECT * FROM faqs"

    db.all(query,function(error,faqs){
        callback(error,faqs)
    })
}

exports.createFAQ = function(question, answer, callback){

    const query = "INSERT INTO faqs (question, answer) VALUES (?, ?)"
    const values = [question, answer]

    db.run(query, values, function(error){
        callback(error, this.lastID)
    })
}

exports.getFAQById = function(id, callback){

    const query = "SELECT * FROM faqs WHERE id = ? LIMIT 1"
    const values = [id]

    db.get(query, values, function(error, faq){
        callback(error, faq)
    })
}


exports.updateFAQById = function(id, question, answer, callback){
    const query = "UPDATE faqs SET question = ?, answer = ? WHERE id = ?"
    const values = [question, answer, id]

    db.run(query, values, function(error){
        callback(error)
    })
}

exports.deleteFAQById = function(id, callback){
    const query = "DELETE FROM faqs WHERE id = ?"
    const values = [id]

    db.run(query, values, function(error){
        callback(error)
    })
}



exports.deleteReviewById = function(id, callback){
    const query = "DELETE FROM reviews WHERE id = ?"
    const values = [id]

    db.run(query, values, function(error){
        callback(error)
    })
}

exports.updateReviewById = function(id, name, rating,  description, callback){
    const query = "UPDATE reviews SET name = ?, rating = ?, description = ? WHERE id = ?"
    const values = [id, name, rating, description]

    db.run(query, values, function(error){
        callback(error)
    })
}

exports.getReviewById = function(id, callback){

    const query = "SELECT * FROM reviews WHERE id = ? LIMIT 1"
    const values = [id]

    db.get(query, values, function(error, review){
        callback(error, review)
    })
}

exports.getAllReviews = function(callback){
    const query = "SELECT * FROM reviews"

    db.all(query,function(error, reviews){
        callback(error, reviews)
    })
}

exports.createReview = function(name, rating, description, callback){

    const query = "INSERT INTO reviews (name ,rating, description) VALUES (?, ?, ?)"
    const values = [name, rating, description]

    db.run(query, values, function(error){
        callback(error, this.lastID)
    })
}