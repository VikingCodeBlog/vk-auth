const jwt = require('jsonwebtoken');
const userBll = require('../bll/user');

const create = async (req, res) => {
  const { name, email, nikName, telf, surname } = req.body;
  const { password } = req.body;
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const IPs = [{ ip, validated: true }];

  if (!name || !password || !surname || !email) {
    return res.status(422).send({
      message: 'Error: empty data [name, password, surname, email]',
    });
  }

  const emailExist = await userBll.findByEmail(email);
  if (emailExist) {
    return res.status(409).send({ message: 'Error email exist' });
  }

  const _user = { name, email, nikName, telf, surname, password, IPs };
  const createdUser = await userBll.create(_user);

  return res.send(createdUser);
};

const validateByEmail = async (req, res) => {
  if (!req.params || !req.params.token) {
    return res.status(401).send({
      message: 'Validation error',
    });
  }

  let userDecoded;
  try {
    userDecoded = jwt.verify(req.params.token, process.env.AUTH_KEY);
  } catch (error) {
    return res.status(401).send({
      message: `Validation error ${error}`,
    });
  }

  const { userId } = userDecoded;

  const user = await userBll.update(userId, {
    validated: true,
  });

  if (user) {
    return res.status(200).send({
      message: 'Validated user',
    });
  }

  return res.status(401).send({
    message: 'Validation error',
  });
};

module.exports = { create, validateByEmail };
