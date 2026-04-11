import Joi from "joi";

export const studentSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),

  description: Joi.string()
    .min(10)
    .max(200)
    .trim()
    .required()
    .messages({
      "string.max": "Description must not exceed 200 characters",
      "string.min": "Description must be at least 10 characters",
    }),

  email: Joi.string().email().required(),

  uid: Joi.number().integer().required(),
});