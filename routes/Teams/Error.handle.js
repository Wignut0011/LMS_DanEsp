const ServerError = require("./Errors");
//Error Handler
function ServerErrorHandle(err, req, res, next){
    console.error(err);

    //Check if error was generated
    if (err instanceof ServerError){
        res.status(err.code).json(err.message);
        return;
    }

    //Error wasn't generated, Internal Error
    res.status(500).json('Internal Server Error');
}
module.exports = ServerErrorHandle;