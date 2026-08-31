const sendResponse = (res, { success, data = null, error = null, status = 200, code = null }) => {
  const body = { success, data, error };
  if (code) {
    body.code = code;
  }
  return res.status(status).json(body);
};

module.exports = { sendResponse };
