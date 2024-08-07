const Joi = require('joi');

const listingJoiSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().default(""),
    image: Joi.string().allow("", null),
    price: Joi.number().default(0).min(0),
    location: Joi.string().default(""),
    country: Joi.string().default("")
});

module.exports = { listingJoiSchema };


module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),
    }).required(),
});