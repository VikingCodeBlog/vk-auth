const authenticateBll = require('../bll/auth');

const localLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(402).send({ mensaje: 'Required [email, password]' });
  }
  const token = await authenticateBll.localLogin(email, password);

  if (!token) {
    return res.status(401).send({ mensaje: 'Incorrect email or password' });
  }

  return res.send({
    mensaje: 'Autenticación correcta',
    token,
  });
};

const checkToken = async (req, res) => {
  const token = req.headers['access-token'];

  if (!token) {
    res.status(401).send({ mensaje: 'Empty token' });
  }

  const decoded = await authenticateBll.checkToken(token);
  if (!decoded) {
    return res.status(401).json({ mensaje: 'Invalid token' });
  }

  return res.json({ mensaje: 'Valid token', decoded });
};

module.exports = { localLogin, checkToken };
