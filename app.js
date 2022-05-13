const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(cors());

const userRoute = require('./api/routes/user');
const oficioRoute = require('./api/routes/oficio');
const candidatoRoute = require('./api/routes/candidato');

app.use('/user', userRoute);
app.use('/oficio', oficioRoute);
app.use('/candidato', candidatoRoute);

module.exports = app;