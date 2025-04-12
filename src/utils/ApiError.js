class ApiError extends Error {
    ApiError( //if error occurs, change this to constructor
        statusCode,
        message = "Something went wrong!",
        errors = [],
        stack = ""
    ){
        super(message)
        this.statusCode = statusCode
        this.data = null    
        this.errors = errors
        this.success = false

        if( stack ) {
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.ApiError) //if error occurs, change this to constructor
        }
    }
}

export { ApiError }