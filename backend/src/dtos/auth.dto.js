const Joi = require("joi");

const signUpSchema = Joi.object({
    username: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required()
});

const signInSchema = Joi.object({
    identifier: Joi.string().required(),
    password: Joi.string().required()
});

module.exports = {
    signUpSchema,
    signInSchema
}