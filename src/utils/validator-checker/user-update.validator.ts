import Joi from "joi";

const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

const registerUser = Joi.object({

    email: Joi.string()
        .pattern(new RegExp(emailRegex)).message("invalid email").required(),

});

export { registerUser };