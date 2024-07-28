const Joi = require('joi');

const listingJoiSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().default(""),
    image: Joi.string().allow("",null),
    price: Joi.number().default(0).min(0),
    location: Joi.string().default(""),
    country: Joi.string().default("")
});

module.exports = { listingJoiSchema };