import {ResponseError} from "../error/response-error.js";

const validate = (schema, req) => {
    // validate request with schema
    const result = schema.validate(req, {
        abortEarly: false,
        // reject unknown field
        allowUnknown: false
    });

    if (result.error) {
        throw new ResponseError(400, result.error.message);
    } else {
        return result.value;
    }
}

export {
    validate
}