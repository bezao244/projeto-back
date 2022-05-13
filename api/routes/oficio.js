const express = require('express');
const router= express.Router();
const mysqlConnection = require('../connection/connection');
const Oficio = require('../models/oficiocs');

//rota de oficio
router.get('/buscarOficios', (req,res)=>{
    return mysqlConnection.query('SELECT * FROM tboficio', (err, rows, fields)=>{
        if(!err){
            let oficios = rows;
            res.json(oficios);
        }else{
            console.log(err);
        }
    });
});

router.post('/filtarPor', (req,res)=>{
    
    return mysqlConnection.query('SELECT * FROM tboficio WHERE ', (err, rows, fields)=>{
        if(!err){
            let oficios = rows;
            res.json(oficios);
        }else{
            console.log(err);
        }
    });
});


router.post('/cadastrarOficio', (req,res)=>{
    if(req.body.oficio.length > 1){
        let oficio = new Oficio(req.body.oficio);
        oficio.save(oficio);
        res.send(true);
    }else{
        res.send(false);
    }
});

router.post('/deletarOficio', (req, res)=>{
    let oficio = new Oficio();
    oficio.delete(req.body.idOficio);
    res.send(true);
})



module.exports = router;