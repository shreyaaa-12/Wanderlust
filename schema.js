const Joi = require('joi');

// Schema for creating new listings (image required)
module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),   
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.object({                      
            url: Joi.string().allow(''),
            filename: Joi.string().allow('')
        }).required()
    }).required()
});

// Schema for updating listings (image optional)
module.exports.listingSchemaUpdate = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    price: Joi.number().required().min(0),
    description: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    image: Joi.object({
      url: Joi.string().allow(''),
      filename: Joi.string().allow('')
    }).optional()   // Image is optional for updates
  }).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),
    }).required(),
});