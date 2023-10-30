import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from 'joi';
import { catchAsync } from "../utils/catch-async";

export enum FieldType {
    "QUERY" = "query",
    "BODY" = "body"
}

export const genericValidator = (templateObj: ObjectSchema<any>, fieldType: FieldType = FieldType.BODY) => {

    return catchAsync(async (req: Request, _: Response, next: NextFunction) => {
        const dataToBeValidate = req[fieldType];

        const validate = await templateObj.validateAsync(dataToBeValidate);

        if (!validate) return next(validate);

        next();
    });
}; 