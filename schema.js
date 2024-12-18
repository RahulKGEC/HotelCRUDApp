const Joi = require('joi');

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    price: Joi.number().required().min(0),
    image: Joi.string().allow('', null) // Allow empty or null for image
  }).required() // Ensure the listing object is required
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5), // Added min and max for rating between 1 to 5
    comment: Joi.string().required() // Fixed typo: `.string.required()` should be `.string().required()`
  }).required() // Ensure the review object is required
});
