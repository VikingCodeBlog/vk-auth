const vkUser = require('../node_modules/vkmongo/src/models/user');
const vkUserData = require('../node_modules/vkmongo/src/models/userData');
const { mongooseTypes } = require('../node_modules/vkmongo/src/helpers/types');
const bcrypt = require("bcrypt");

async function checkEmail(email, res) {
    const exist = await vkUserData.findOne({ email })
    if (exist) {
        res.status(409).send({ message: 'Error email exist' })
    }

    return !exist;
}

async function hassPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

const create = async (req, res) => {
    let { name, password, email, nikName, telf, surname } = req.body;

    if (!name || !password || !surname || !email) {
        return res.status(422).send({
            message: 'Error: empty data [name, password, surname, email]'
        });
    }

    const validEmail = await checkEmail(email, res);

    if (!validEmail) {
        return;
    }

    password = await hassPassword(password);

    const newUser = new vkUser({
        _id: new mongooseTypes.ObjectId(),
        name,
        password,
        surname
    });

    const createdUser = await newUser.save();
    const userData = new vkUserData({
        user: createdUser._id,
        nikName,
        telf,
        email,
        lastConnection: new Date()
    });

    createdUser.data = await userData.save();
    return res.send(createdUser);
}

module.exports = { create }