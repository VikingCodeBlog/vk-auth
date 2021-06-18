const userBll = require('../bll/user');

const create = async (req, res) => {
  const { name, email, nikName, telf, surname } = req.body;
  const { password } = req.body;
  if (!name || !password || !surname || !email) {
    return res.status(422).send({
      message: 'Error: empty data [name, password, surname, email]',
    });
  }

  const emailExist = await userBll.findByEmail(email);
  if (emailExist) {
    return res.status(409).send({ message: 'Error email exist' });
  }

  const _user = { name, email, nikName, telf, surname, password };
  const createdUser = await userBll.create(_user);

  return res.send(createdUser);
};

const validateByEmail = async (req, res) => {
  if (!req.params || !req.params.id) {
    return res.status(401).send({
      message: 'Validation error',
    });
  }

  const user = await userBll.update(req.params.id, {
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
