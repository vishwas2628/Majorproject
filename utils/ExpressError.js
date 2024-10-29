class ExpressErr extends Error{
    constructor(statusCode, message){
        super();
        this.statusCode = statusCode;
        this.message = message;
    }
}
export const ExpressError = ExpressErr ;