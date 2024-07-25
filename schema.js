const Joi = require('joi');

const listingJoiSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().default(""),
    image: Joi.string().default("https://unsplash.com/photos/a-green-and-blue-sky-with-a-lot-of-snow-4gIJkfVcnWM"),
    price: Joi.number().default(0).min(0),
    location: Joi.string().default(""),
    country: Joi.string().default("")
});

module.exports = { listingJoiSchema };