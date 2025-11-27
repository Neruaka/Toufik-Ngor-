const Joi = require("joi");

const itemCreateSchema = Joi.object({
    title: Joi.string().min(1).required(),
    author: Joi.string().min(1).required(),
    imageUrl: Joi.string().uri().allow(null, "").optional(),
    description: Joi.string().allow(null, "").optional(),
    tags: Joi.array().items(Joi.string()).optional()
});

const itemUpdateSchema = Joi.object({
    title: Joi.string().min(1).optional(),
    author: Joi.string().min(1).optional(),
    imageUrl: Joi.string().uri().allow(null, "").optional(),
    description: Joi.string().allow(null, "").optional(),
    status: Joi.string().valid("to_read", "reading", "finished").optional(),
    rating: Joi.number().min(1).max(5).allow(null).optional(),
    tags: Joi.array().items(Joi.string()).optional()
});

module.exports = {
    itemCreateSchema,
    itemUpdateSchema
};