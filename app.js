const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());

const userRoute = require('./api/routes/user');
const oficioRoute = require('./api/routes/oficio');
const candidatoRoute = require('./api/routes/candidato');
const empresaRoute = require('./api/routes/empresa');
const avaliadorRoute = require('./api/routes/avaliador.js');
const itemRoute = require('./api/routes/item.js');

app.use('/user', userRoute);
app.use('/oficio', oficioRoute);
app.use('/candidato', candidatoRoute);
app.use('/empresa', empresaRoute);
app.use('/avaliador', avaliadorRoute);
app.use('/item', itemRoute);

module.exports = app;