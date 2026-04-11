export const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, {
    abortEarly: false, // show all errors
  });

  if (error) {
    return res.status(400).json({
      message: "Validation Error",
      errors: error.details.map((err) => err.message),
    });
  }

  next();
};