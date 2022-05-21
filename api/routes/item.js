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
    mysqlConnection.query('SELECT tbitem.idOficio, tbitem.descricao FROM tbitem inner join tboficio ON tbitem.idOficio = tboficio.idOficio WHERE tbitem.idOficio = ?', [req.body.idOficio],
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
    mysqlConnection.query('INSERT INTO tbitem(idoficio, descricao) VALUES(?, ?)', [req.body.idOficio, req.body.descricao],
        (err, rows) => {
            if (!err) {
                res.send(true);
            } else {
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

module.exports = router;