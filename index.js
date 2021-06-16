const express = require('express');
const dotenv = require('dotenv');
const localLogin = require('./src/localLogin');
const createUser = require('./src/createUser');

const app = express();
app.use(express.json());

if (!process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

// Init mongo database
const db = require('vkmongo');

const server = app.listen(process.env.port || 3000, () => {
  console.log('vkAuth up');
});

// Routes
app.post('/create', createUser.create);
app.post('/authenticate', localLogin.authenticate);
app.get('/checkAuth', localLogin.checkAuth);

module.exports = {app, db, server};