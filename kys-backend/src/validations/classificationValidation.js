const Joi = require('joi');

const createSupportPlanSchema = Joi.object({
  studentId: Joi.number().integer().required(),
  type: Joi.string().valid('slow', 'advanced').required(),
  mechanism: Joi.string().required(),
  scheduledAt: Joi.date().iso().required(),
  notes: Joi.string().allow('').optional()
});

const updateSupportPlanSchema = Joi.object({
  status: Joi.string().valid('pending', 'completed', 'cancelled').optional(),
  notes: Joi.string().allow('').optional()
}).min(1);

module.exports = {
  createSupportPlanSchema,
  updateSupportPlanSchema
};
