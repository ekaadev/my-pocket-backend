import Joi from "joi";

export const createContactValidation = Joi.object({
    first_name: Joi.string().required().max(100),
    last_name: Joi.string().optional().max(100),
    email: Joi.string().email().optional().max(200),
    phone: Joi.string().optional().max(20)
});

export const getContactValidation = Joi.number().required().positive();

export const updateContactValidation = Joi.object({
    id: Joi.number().required().positive(),
    first_name: Joi.string().required().max(100),
    last_name: Joi.string().optional().max(100),
    email: Joi.string().email().optional().max(200),
    phone: Joi.string().optional().max(20)
});

export const searchContactValidation = Joi.object({
    name: Joi.string().optional(),
    email: Joi.string().optional(),
    phone: Joi.string().optional()
});