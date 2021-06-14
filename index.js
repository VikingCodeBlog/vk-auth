const express = require('express');
const app = express();
const localLogin = require('./src/localLogin')
const createUser = require('./src/createUser')
app.use(express.json());

if (!process.env.production) {
    require('dotenv').config()
}

//Init mongo database
const db = require('vkmongo');

app.listen(process.env.port || 3000, () => {
    console.log('vkAuth up')
});

// Routes
app.post('/create', createUser.create);
app.post('/authenticate', localLogin.authenticate);
app.get('/checkAuth', localLogin.checkAuth);