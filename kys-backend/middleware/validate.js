const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, {
    abortEarly: false,
    convert: true,
  });

  if (error) {
    return res.status(400).json({
      message: 'Validation Error',
      errors: error.details.map((err) => err.message),
    });
  }

  return next();
};

module.exports = { validate };
