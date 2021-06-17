const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { VK_UserData } = require('vkmongo/models');

async function userExist(email) {
  return VK_UserData.findOne({ email }).populate('user');
}

async function checkPassword(userData, inputPassword) {
  if (!userData) {
    return false;
  }

  return bcrypt.compare(inputPassword, userData.user.password);
}

const authenticate = async (req, res) => {
  const { email, password } = req.body;
  const userData = await userExist(email);
  const correctPassword = await checkPassword(userData, password);
  if (userData && correctPassword) {
    const payload = {
      check: true,
      userId: userData.user._id,
    };

    const token = jwt.sign(payload, process.env.AUTH_KEY, {
      expiresIn: 20000,
    });

    res.send({
      mensaje: 'Autenticación correcta',
      token,
    });
  } else {
    res.status(401).send({ mensaje: 'Incorrect email or password' });
  }
};

const checkAuth = (req, res) => {
  const token = req.headers['access-token'];
  if (token) {
    jwt.verify(token, process.env.AUTH_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).json({ mensaje: 'Invalid token' });
      }

      return res.json({ mensaje: 'Valid token', decoded });
    });
  } else {
    res.status(401).send({ mensaje: 'Empty token' });
  }
};

module.exports = { authenticate, checkAuth };
