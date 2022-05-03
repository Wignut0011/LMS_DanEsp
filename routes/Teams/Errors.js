//Error object
class ServerError{
    constructor(code, msg) {
        this.code = code;
        this.message = msg;
    }
    //For bad queries, build error message here
    static IncompleteQuery = (missing, Unprocess = false) => {
        //Create message from error list
        let returnMsg = "Submit Error:  "+missing.map((i)=>{
            return i.msg + ' ' + i.value;
        }).join('  |  ')

        if (Unprocess)
            return ServerError.Unprocessable(returnMsg); //Return Unprocessable Entity Error

        return ServerError.BadRequest(returnMsg); //Return Bad Request Error
    };

    //Full list of used errors
    static BadRequest = (msg)=>{return new ServerError(400, msg)} //Bad Request
    static NotFound = (msg)=>{return new ServerError(404, msg)} //Not Found
    static Conflict = (msg)=>{return new ServerError(409, msg)} //General Database Error
    static Gone = (msg)=>{return new ServerError(410, msg)} //Gone (for image missing)
    static Unprocessable = (msg)=>{return new ServerError(422, msg)} //Gone (for image missing)
    static InternalError = (msg)=>{return new ServerError(500, msg)} //Internal
}
module.exports = ServerError;