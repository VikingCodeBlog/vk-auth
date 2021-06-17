const bcrypt = require('bcrypt');
const { VK_User, VK_UserData } = require('vkmongo/models');
const { mongooseTypes } = require('vkmongo/helpers');

async function checkEmail(email, res) {
  const exist = await VK_UserData.findOne({ email });
  if (exist) {
    res.status(409).send({ message: 'Error email exist' });
  }

  return !exist;
}

async function hassPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

const create = async (req, res) => {
  const { name, email, nikName, telf, surname } = req.body;
  let { password } = req.body;
  if (!name || !password || !surname || !email) {
    return res.status(422).send({
      message: 'Error: empty data [name, password, surname, email]',
    });
  }

  const validEmail = await checkEmail(email, res);

  if (validEmail) {
    password = await hassPassword(password);

    const newUser = new VK_User({
      _id: new mongooseTypes.ObjectId(),
      name,
      password,
      surname,
    });

    let createdUser = await newUser.save();
    const userData = new VK_UserData({
      user: createdUser._id,
      nikName,
      telf,
      email,
      lastConnection: new Date(),
    });

    createdUser = createdUser.toObject();
    delete createdUser.password;
    createdUser.data = await userData.save();
    return res.send(createdUser);
  }

  return res.status(500).send({ message: 'Unexpected error' });
};

module.exports = { create };
