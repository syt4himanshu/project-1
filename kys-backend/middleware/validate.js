const { validationResult } = require('express-validator');
const { sendResponse } = require('../utils/responseWrapper');

// Schema-based validator (e.g., Joi)
const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, {
    abortEarly: false,
    convert: true,
  });

  if (error) {
    return sendResponse(res, {
      success: false,
      status: 400,
      error: error.details.map((err) => err.message).join(', '),
    });
  }

  next();
};

// express-validator middleware
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMsg = errors
      .array()
      .map((e) => `${e.path}: ${e.msg}`)
      .join(', ');

    return sendResponse(res, {
      success: false,
      status: 400,
      error: errorMsg,
    });
  }

  next();
};

module.exports = {
  validate,
  validateRequest,
};