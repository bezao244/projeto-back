const express = require('express');
const router = express.Router();
const mysqlConnection = require('../connection/connection');
const Candidato = require('../models/candidatocs');
const candidato = new Candidato();

router.get('/listarCandidatos', (req, res) => {
    mysqlConnection.query('SELECT * FROM tbcandidato ', (err, rows) => {
        if (!err) {
            res.send(rows);
        } else {
            res.send(false);
        }
    });
});
router.post('/buscarDadosCandidato', (req, res) => {
    mysqlConnection.query('SELECT * FROM tbcandidato where idCandidato = ?', [req.body.idCandidato], (err, rows) => {
        if (!err) {
            res.send(rows);
        } else {
            res.send(false);
        }
    });
});

router.get('/filtrarPorNota', (req, res) => {
    mysqlConnection.query('SELECT * FROM tbcandidato where notafinal is null', (err, rows) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);
        }
    });
});

router.post('/filtrar', (req, res) => {
    let nome = req.body.nome + '%';
    mysqlConnection.query('SELECT * FROM tbcandidato WHERE nome LIKE ? OR cpf LIKE ?', [nome, nome], (err, rows) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);
        }
    });
});

router.post('/filtrarSemNota', (req, res) => {
    let query = `SELECT * FROM tbcandidato where notafinal is null`;

    if (req.body.nome != null) {
        let nome = req.body.nome + '%';
        query += ` AND nome LIKE '${nome}'`;
    }
    if (req.body.cpf != null) {
        let cpf = req.body.cpf + '%';
        query += ` AND cpf LIKE '${cpf}'`;
    }
    mysqlConnection.query(query, (err, rows) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log(err);
        }
    });
});

router.post('/adicionarNotaCandidato', (req, res) => {
    mysqlConnection.query('update tbcandidato set notafinal = ? where idCandidato = ?', [req.body.notaFinal, req.body.idCandidato],
        (err, rows) => {
            if (!err) {
                console.log('nota cadastrada');
                res.send(true);
            } else {
                res.send(false);
                console.log(err);
            }
        });
});

router.post('/createCandidato', (req, res) => {
    var candidato = new Candidato(req.body.nome, req.body.cpf, req.body.idAvaliador, req.body.idEmpresa, req.body.oficio);
    candidato.save(candidato);
    res.send(true);
});

router.post('/deletarCandidato', (req, res) => {
    candidato.delete(req.body.idCandidato);
    res.send(true);
});

module.exports = router;