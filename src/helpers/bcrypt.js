const bcrypt = require('bcrypt');

const compare = async (pass, dbPass) => bcrypt.compare(pass, dbPass);

const hassPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

module.exports = { hassPassword, compare };
