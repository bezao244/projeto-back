const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(cors());

const userRoute = require('./api/routes/user');
const oficioRoute = require('./api/routes/oficio')

app.use('/user', userRoute);
app.use('/oficio', oficioRoute);
module.exports = app;