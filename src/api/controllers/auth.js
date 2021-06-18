const authenticateBll = require('../bll/auth');

const localLogin = async (req, res) => {
  const { email, password, ipCode } = req.body;
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  if (!email || !password) {
    return res.status(402).send({ mensaje: 'Required [email, password]' });
  }

  const authResponse = await authenticateBll.localLogin(email, password);
  const { token, IPs, noValidated } = authResponse;

  if (noValidated) {
    return res.status(402).send({ mensaje: 'User not validated' });
  }

  if (!token) {
    return res.status(401).send({ mensaje: 'Incorrect email or password' });
  }

  if (ipCode) {
    const validatedIP = await authenticateBll.validateIP(ip, IPs, email, ipCode); // eslint-disable-line
    if (!validatedIP) {
      return res.status(403).send({ mensaje: 'Ip not validated' });
    }
  } else {
    const validIp = await authenticateBll.checkIP(ip, IPs, email);
    if (!validIp) {
      return res.status(403).send({ mensaje: 'Ip not validated' });
    }
  }

  return res.send({
    mensaje: 'Autenticación correcta',
    token,
  });
};

const sendIpCode = async (req, res) => {
  const { email, password } = req.body;
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  if (!email || !password) {
    return res.status(402).send({ mensaje: 'Required [email, password]' });
  }

  const authResponse = await authenticateBll.localLogin(email, password);
  const { IPs } = authResponse;

  const validIp = await authenticateBll.checkIP(ip, IPs, email);
  if (!validIp) {
    return res.status(200).send({ mensaje: 'Ip not validated' });
  }

  return res.status(500).send({ mensaje: 'Ip already validated' });
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

module.exports = { localLogin, checkToken, sendIpCode };
