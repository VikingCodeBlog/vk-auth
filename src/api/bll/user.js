const emailHelper = require('../../helpers/email');
const bcrypt = require('../../helpers/bcrypt');
const userRepository = require('../repository/user');

const findByEmail = async (email) => userRepository.findByEmail(email);
const update = async (id, user) => userRepository.update(id, user);

const create = async (user) => {
  const _user = user;
  const hassedPassword = await bcrypt.hassPassword(_user.password);
  _user.password = hassedPassword;

  let createdUser = await userRepository.create(_user);
  createdUser = createdUser.toObject();
  createdUser.data = await userRepository.createData(createdUser, _user);
  delete createdUser.password;

  emailHelper.sendValidateUser(createdUser);
  return createdUser;
};

module.exports = { findByEmail, create, update };
