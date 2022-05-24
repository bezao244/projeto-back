const express = require('express');
const router = express.Router();
const mysqlConnection = require('../connection/connection');
const Avaliador = require('../models/avaliadorcs');


router.post('/buscarIdAvaliador', (req, res) => {
    mysqlConnection.query('SELECT * FROM tbavaliador WHERE idUsuario = ?', [req.body.idUsuario], (err, rows) => {
        if (!err) {
            var modal = {
                idAvaliador: rows[0].idAvaliador
            }
            res.send(modal);
        } else {
            res.send(false);
        }
    });
});
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
    mysqlConnection.query('SELECT tbcandidato.idCandidato, tbcandidato.nome, tbcandidato.cpf,tbcandidato.dataInclusao, tbcandidato.notaTeorica, tbcandidato.idAvaliador, tbcandidato.idEmpresa, tbcandidato.idOficio, tboficio.oficio FROM tbcandidato inner join tboficio ON tbcandidato.idOficio = tboficio.idOficio inner join tbavaliador ON tbcandidato.idavaliador = tbavaliador.idAvaliador WHERE tbavaliador.idAvaliador = ? AND tbcandidato.foiAvaliado is null', [req.body.idUsuario], (err, rows) => {
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
        nome: req.body.nome,
        oficio: req.body.oficio,
        dataInclusao: req.body.dataInclusao
    }

    let query = `SELECT c.nome, c.cpf, c.idCandidato, tboficio.oficio FROM tbcandidato AS c 
    inner join tboficio ON c.idOficio = tboficio.idOficio
    WHERE c.idAvaliador = ${modal.idAvaliador} AND c.foiAvaliado is null`;

    if (modal.oficio != null) {
        console.log(modal.oficio);
        query += ` AND tboficio.oficio =  '${modal.oficio}'`;
    }
    if (modal.nome != null) {
        let nome = modal.nome + '%';
        query += ` AND c.nome LIKE '${nome}'`;
    }
    if (modal.dataInclusao != null) {
        query += ` AND c.datainclusao =  ${modal.dataInclusao}`;
    }
    console.log(query);
    mysqlConnection.execute(query, (err, rows) => {
        if (!err) {
            res.send(rows);
        } else {
            res.send(false);
        }
    });

});

module.exports = router;