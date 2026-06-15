class ErrorExpress extends Error {
    constructor(message, status = 500) {
        super();
        this.message = message;
        this.status = status;
        // console.error(this.stack)
        console.error(
            "ErrorExpress created with message:", message, 
            "and status:", status);
    }
}

module.exports = ErrorExpress