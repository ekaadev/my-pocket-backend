import {ResponseError} from "../error/response-error.js";

// catch error
const errorMiddleware = (err, req, res, next) => {
    try {
        if (!err) {
            next()
            return;
        }

        if (err instanceof ResponseError) {
            res.status(err.status).json({
                errors: err.message
            }).end();
        } else {
            res.status(500).json({
                errors: err.message
            }).end();
        }
    } catch (error) {
        res.status(500).json({ errors: 'Unexpected error occurred' }).end();
    }
}

export {
    errorMiddleware
}