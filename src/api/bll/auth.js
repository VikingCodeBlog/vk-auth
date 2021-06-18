const jwt = require('jsonwebtoken');
const { mongooseTypes } = require('vkmongo/helpers');
const bcryptHelper = require('../../helpers/bcrypt');
const emailHelper = require('../../helpers/email');
const userRepository = require('../repository/user');

const localLogin = async (email, password) => {
  const userData = await userRepository.findByEmail(email);
  if (!userData) {
    return false;
  }

  if (!userData.user.validated) {
    return { noValidated: true };
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

  const token = jwt.sign(payload, process.env.AUTH_KEY, {
    expiresIn: 20000,
  });

  const { IPs } = userData;
  return { token, IPs };
};

const checkToken = async (token) => {
  try {
    return jwt.verify(token, process.env.AUTH_KEY);
  } catch (error) {
    return false;
  }
};

const checkIP = async (_ip, IPs, email) => {
  const _IPs = IPs.toObject();
  const existIP = _IPs.find((ipData) => ipData.ip === _ip);
  const validIP = existIP && existIP.validated;
  const randomCode = Math.floor(1000 + Math.random() * 9000);

  if (!validIP) {
    if (existIP) {
      existIP.code = randomCode;
      const index = IPs.findIndex((ipData) => ipData.ip === _ip);
      _IPs[index] = existIP;
    } else {
      _IPs.push({
        _id: new mongooseTypes.ObjectId(),
        ip: _ip,
        validated: false,
        code: randomCode,
      });
    }

    await userRepository.updateDataByEmail(email, { IPs: _IPs });
    emailHelper.sendValidateIP(_ip, IPs, email, randomCode);
    return false;
  }

  return validIP;
};

const validateIP = async (_ip, IPs, email, ipCode) => {
  const _IPs = IPs.toObject();
  const existIP = _IPs.find((ipData) => ipData.ip === _ip && ipData.code === ipCode); // eslint-disable-line
  if (!existIP) {
    return false;
  }

  existIP.validated = true;
  const index = IPs.findIndex((ipData) => ipData.ip === _ip);
  _IPs[index] = existIP;

  await userRepository.updateDataByEmail(email, { IPs: _IPs });

  return true;
};

module.exports = { localLogin, checkToken, checkIP, validateIP };
