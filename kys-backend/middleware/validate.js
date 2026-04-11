const { validationResult } = require('express-validator');
const { sendResponse } = require('../utils/responseWrapper');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMsg = errors.array().map(e => `${e.path}: ${e.msg}`).join(', ');
    return sendResponse(res, { success: false, status: 400, error: errorMsg });
  }
  next();
};

module.exports = { validateRequest };
