const express = require('express');
const router = express.Router();
const mysqlConnection = require('../connection/connection');
const Avaliador = require('../models/avaliadorcs');

router.post('/createAvaliador', (req, res) => {
    var avaliador = new Avaliador(req.body.idUsuario, req.body.nome, req.body.cpf);
    avaliador.save(avaliador);
    res.send(true);
});
router.get('/buscarAvaliadores', (req, res) => {
    mysqlConnection.query('SELECT * FROM tbavaliador', (err, rows) => {
        if (!err) {
            res.send(rows);
        } else {
            res.send(false);
        }
    });
});

router.post('/listarPorAvaliador', (req, res) => {
    mysqlConnection.query('SELECT * FROM tbcandidato where idAvaliador = ?', [req.body.idAvaliador], (err, rows) => {
        if (!err) {
            res.send(rows);
        } else {
            res.send(false);
        }
    });
});


//FILTROS
router.post('/filtrarAvaliador', (req, res) => {

    let modal = {
        idAvaliador: req.body.idAvaliador,
        idOficio: req.body.idOficio,
        nome: req.body.nome,
        dataInclusao: req.body.dataInclusao
    }

    let query = `SELECT * FROM tbcandidato where idAvaliador = ${modal.idAvaliador}`;

    if (modal.idOficio != 0) {
        query += `AND idOficio =  ${modal.idOficio}`;
    }
    if (modal.nome != 0) {
        query += `AND nome =  ${modal.nome}`;
    }
    if (modal.dataInclusao != 0) {
        query += `AND datainclusao =  ${modal.dataInclusao}`;
    }

    mysqlConnection.execute(query, (err, rows) => {
        if (!err) {
            res.send(rows);
        } else {
            res.send(false);
        }
    });

});

module.exports = router;