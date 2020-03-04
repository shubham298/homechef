const ErrorResponse = require('../utils/errorResponse')

const errorHandler = (err, req, res, next) => {
    //log to console for dev
    let error = { ...err };
    console.log(error)
    error.message = err.message;
    //Mongoose bad ObjectID
    if (err.name === 'CastError') {
        const message = `Resource not found with id ${err.value}`;
        error = new ErrorResponse(message, 404)
    }
    //Mongoose duplicate key
    if (err.name === 'MongoError') {
        const message = `Duplicate field value entered`
        error = new ErrorResponse(message, 400)
    }
    //Mongoose ValidatorError
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val=>val.message)
        error = new ErrorResponse(message, 400)
    }

    res.status(error.statuscode || 500).json({
        success: false,
        error: error.message || 'Server Error'
    })
}

module.exports = errorHandler