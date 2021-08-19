const Joi = require('joi');


const validator = Joi.object({
    fullname: Joi.string()
        .lowercase()
        .required(), 

    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net']}})
        .required(),

    subject: Joi.string().required(),
    message: Joi.string().required(),
});

module.exports = { validator };