import Joi from 'joi';

export const createAddressValidation = Joi.object({
    street: Joi.string().optional().max(255),
    city: Joi.string().optional().max(100),
    province: Joi.string().optional().max(100),
    country: Joi.string().required().max(100),
    postal_code: Joi.string().required().max(10)
});

export const getAddressValidation = Joi.number().required().positive().min(1);

export const updateAddressValidation = Joi.object({
    id: Joi.number().required().positive().min(1),
    street: Joi.string().optional().max(255),
    city: Joi.string().optional().max(100),
    province: Joi.string().optional().max(100),
    country: Joi.string().required().max(100),
    postal_code: Joi.string().required().max(10)
})
