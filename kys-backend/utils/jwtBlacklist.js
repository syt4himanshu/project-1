const blacklist = new Set();

const addJti = (jti) => blacklist.add(jti);
const hasJti = (jti) => blacklist.has(jti);

module.exports = {
  addJti,
  hasJti,
};
