const jwt = require('jsonwebtoken');
const bcryptHelper = require('../../helpers/bcrypt');
const userRepository = require('../repository/user');

const localLogin = async (email, password) => {
  const userData = await userRepository.findByEmail(email);
  if (!userData) {
    return false;
  }

  const dbPassword = userData.user.password;
  const correctPassword = await bcryptHelper.compare(password, dbPassword);
  if (!correctPassword) {
    return false;
  }

  const payload = {
    check: true,
    userId: userData.user._id,
  };

  return jwt.sign(payload, process.env.AUTH_KEY, {
    expiresIn: 20000,
  });
};

const checkToken = async (token) => {
  try {
    return jwt.verify(token, process.env.AUTH_KEY);
  } catch (error) {
    return false;
  }
};

module.exports = { localLogin, checkToken };
