import { CustomError } from "../utils/custom-error";
import { ErrorRequestHandler, Response, Request } from "express";
import { errorTranslator } from "../utils/error-translator";

const sendError = (err: CustomError | Error, res: Response) => {
    if (err instanceof CustomError) {
        res.status(err.errStatus());
        res.json(err.errInfo());
    }
    else {
        // unwanted data
        delete (err as any).request;
        // delete (err as any).response;
        delete (err as any).config;

        console.log(Object.keys(err));
        for (const [k, v] of Object.entries(err)) {
            console.log(`${k} ===> ${v}`);
        }

        res.status(500).send('oh oh sth bad happened 😓');

    }
};

function handleDuplicateFieldDB() {
    return new CustomError('Duplication of data', 400, 1101);
}

function handleValidation(err: any) {
    // mongoose validation error (database-side)
    if (err._message)
        return new CustomError(`${err._message}: ${Object.keys(err.errors)}`, 400, 1102);

    // joi validation error (server-side)
    else if (typeof (err._original) === 'object')
        return new CustomError(err.message, 400, 1103);
}

function handleJWTError() {
    return new CustomError('invalid token Please login!', 401, 1201);
}

function handleTokenExpired() {
    return new CustomError('token expired Please login again!', 401, 1202);
}

function handleAxiosErrors(err: any) {
    // inconsistency with daap error responses |-_-|
    if (err.response.data.error) {
        const error = err.response.data.error;
        return new CustomError(error.message, error.code, error.code);
    }

    else if (err.response.data) {
        if (err.response.status === 502) {
            return new CustomError("Daap is down please try again later...", err.response.status, err.response.status);
        }

        const error = err.response.data;
        return new CustomError(error.message, error.status, error.status);
    }
    const error = err.response;

    return new CustomError(`Daap ${error.statusText}`, error.status, error.status);
}


const errorHandler: ErrorRequestHandler = async (err, req, res, next) => {

    let error: any = err;

    if (err.code === 11000) {
        error = handleDuplicateFieldDB();
    }

    else if (error.name === 'ValidationError') {
        error = handleValidation(error);
    }

    else if (error.name === 'JsonWebTokenError') {
        error = handleJWTError();
    }

    else if (error.name === 'TokenExpiredError') {
        error = handleTokenExpired();
    }

    else if (error.name === 'AxiosError') {
        error = handleAxiosErrors(error);
    };

    sendError(error, res);
    next();

};

export { errorHandler };