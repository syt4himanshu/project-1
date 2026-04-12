const sendResponse = (res, { success, data = null, error = null, status = 200 }) => {
  return res.status(status).json({ success, data, error });
};

module.exports = { sendResponse };
