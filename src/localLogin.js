const vkUserData = require('../node_modules/vkmongo/src/models/userData');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");

async function userExist(email){
    return await vkUserData.findOne({email}).populate('user');
}

async function checkPassword(userData, inputPassword){
    if(!userData){
        return;
    }

    return await bcrypt.compare(inputPassword, userData.user.password);
}

const authenticate = async (req, res) => {
    const {email, password} = req.body;
    const userData = await userExist(email);
    const correctPassword = await checkPassword(userData, password);
    if (userData && correctPassword) {
        const payload = {
            check: true,
            userId: userData.user._id
        };

        const token = jwt.sign(payload, process.env.AUTH_KEY, {
            expiresIn: 20000
        });

        res.send({
            mensaje: 'Autenticación correcta',
            token: token
        });

    } else {
        res.status(401).send({ mensaje: "Incorrect email or password" })
    }
}

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
}

module.exports = {authenticate, checkAuth}