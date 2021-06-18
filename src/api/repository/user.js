const { VK_UserData, VK_User } = require('vkmongo/models');
const { mongooseTypes } = require('vkmongo/helpers');

const findByEmail = async (email) => VK_UserData.findOne({ email }).populate('user'); // eslint-disable-line

const update = async (id, user) => VK_User.findByIdAndUpdate(id, user);
const updateDataByEmail = async (email, newUserData) => {
  const userData = await VK_UserData.findOne({ email }).populate('user');
  return VK_UserData.findByIdAndUpdate(userData._id, newUserData);
};

const create = async (user) => {
  const { name, surname, password } = user;
  const newUser = new VK_User({
    _id: new mongooseTypes.ObjectId(),
    name,
    surname,
    password,
    validated: false,
  });

  return newUser.save();
};

const createData = async (createdUser, user) => {
  const { nikName, telf, email, IPs } = user;

  const userData = new VK_UserData({
    user: createdUser._id,
    nikName,
    telf,
    email,
    IPs,
    lastConnection: new Date(),
  });

  return userData.save();
};

module.exports = {
  findByEmail,
  create,
  createData,
  update,
  updateDataByEmail,
};
