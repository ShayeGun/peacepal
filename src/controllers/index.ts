import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../utils/catch-async";
import { User } from "../models/user.schema";
import { CustomError } from "../utils/custom-error";


export const registerUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    const existedUser = await User.findOne({ email });
    if (existedUser) return next(new CustomError("email already registered", 400, 100));

    const user = await User.create({ email });

    res.status(201).json({
        // because of Parsa --> unclean code -_-
        status: 201,
        data: user
    });
});

export const getAllUsersInfo = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const emails = await User.find({});

    res.json({
        data: emails
    });
});