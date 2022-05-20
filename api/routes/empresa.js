const express = require('express');
const router = express.Router();
const mysqlConnection = require('../connection/connection');
const Empresa = require('../models/empresacs');

router.get('/listarEmpresa', (req, res) => {
    mysqlConnection.query('SELECT * FROM tbempresa', (err, rows) => {
        if (!err) {
            res.send(rows);
        } else {
            res.send(false);
        }
    })
})
router.post('/listarPorEmpresa', (req, res) => {

    mysqlConnection.query('SELECT * FROM tbcandidato where idEmpresa = ?', [req.body.idUsuario], (err, rows) => {
        if (!err) {
            res.send(rows);
        } else {
            res.send(false);
        }
    });
});

router.post('/filtrarEmpresa', (req, res) => {
    let query = `SELECT * FROM tbcandidato where idEmpresa = ${req.body.idEmpresa}`;
    if (req.body.nome != null) {
        let nome = req.body.nome + '%';
        query += ` AND nome LIKE '${nome}'`;
    }
    if (req.body.oficio != null) {
        query += ` AND oficio = '${req.body.oficio}'`;
    }
    if (req.body.dataInclusao != null) {
        query += ` AND dataInclusao = '${req.body.dataInclusao}'`;
    }
    console.log(query);
    mysqlConnection.query(query, (err, rows) => {
        if (!err) {
            res.send(rows);
        } else {
            res.send(false);
        }
    });
});

router.post('/buscarNomeEmpresa', (req, res) => {
    mysqlConnection.query('SELECT nomeEmpresa FROM tbempresa WHERE idUsuario = ?', [req.body.idUsuario], (err, rows) => {
        console.log(req.body);
        if (!err) {
            console.log(rows);
            let modal = {
                nomeEmpresa: rows[0].nomeEmpresa
            }
            res.send(modal);
        } else {
            res.send(false);
        }
    });
});
router.post('/createEmpresa', (req, res) => {
    var empresa = new Empresa(req.body.idUsuario, req.body.nomeEmpresa, req.body.cnpj, req.body.razaoSocial, req.body.dsLogradouro, req.body.cep, req.body.telResp, req.body.telFixo, req.body.nomeResp, req.body.nmFantasia);
    empresa.save(empresa);
    res.send(true);
});

module.exports = router;