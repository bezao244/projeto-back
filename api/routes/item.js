const express = require('express');
const res = require('express/lib/response');
const router = express.Router();
const mysqlConnection = require('../connection/connection');


router.get('/listar', (req, res) => {
    mysqlConnection.query('SELECT * FROM tbitem', (err, rows) => {
        if (!err) {
            res.send(rows);
        } else {
            res.send(false);
        }
    });
});

router.post('/buscarQuestoesProva', (req, res) => {
    mysqlConnection.query('SELECT tbitem.idOficio, tbitem.descricao, tbitem.peso, tbitem.idItem, tbitem.competencia FROM tbitem inner join tboficio ON tbitem.idOficio = tboficio.idOficio WHERE tbitem.idOficio = ?', [req.body.idOficio],
        (err, rows) => {
            if (!err) {
                res.send(rows);
            } else {
                console.log('deu erro', err);
            }
        })
});

router.post('/create', (req, res) => {
    console.log(req.body);
    mysqlConnection.query('INSERT INTO tbitem(idoficio, descricao, competencia, peso) VALUES(?, ?, ?, ?)', [req.body.idOficio, req.body.descricao, req.body.competencia, req.body.peso],
        (err, rows) => {
            if (!err) {
                console.log('item cadastro com sucesso')
                res.send(true);
            } else {
                console.log(err);
                res.send(false);
            }
        })
});
router.post('/deletar', (req, res) => {
    console.log(req.body);
    mysqlConnection.query('DELETE FROM tbitem WHERE iditem = ?', [req.body.idItem],
        (err, rows) => {
            if (!err) {
                res.send(true);
                console.log('deletado com sucesso');
            } else {
                res.send(false);
                console.log('erro ao deletar', err);
            }
        });
});

router.post('/adicionarNotaPorItem', (req, res) => {
    mysqlConnection.query('INSERT INTO tbnotaitem(iditem, idcandidato, notaitem) VALUES(?, ?, ?)',
        [req.body.idItem, req.body.idCandidato, req.body.notaItem], (err, rows) => {
            if (!err) {
                res.send(true);
                console.log('nota do item adicionada com sucesso!');
            } else {
                res.send(false);
                console.log(err);
            }
        });
});

router.post('/adicionarNotaSegTrab', (req, res) => {
    mysqlConnection.query('UPDATE tbnotaitem SET notasegtrab = ? WHERE idcandidato = ?',
        [req.body.notaSegTrab, req.body.idCandidato], (err, rows) => {
            if (!err) {
                res.send(true);
                console.log('nota do seguranca do traballho adicionada com sucesso!');
            } else {
                res.send(false);
                console.log(err);
            }
        });
});
router.post('/setAvaliado', (req, res) => {
    mysqlConnection.query('update tbcandidato set foiAvaliado = true where idCandidato = ?',
        [req.body.idCandidato], (err, rows) => {
            if (!err) {
                res.send(true);
                console.log('foi avaliado com sucesso');
            } else {
                res.send(false);
                console.log(err);
            }
        });
});

module.exports = router;