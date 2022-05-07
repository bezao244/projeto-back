const express = require('express');
const router= express.Router();
const mysqlConnection = require('../connection/connection');

//rota de oficio

router.get('/', (req,res)=>{
    return mysqlConnection.query('SELECT * FROM oficio', (err, rows, fields)=>{
        if(!err){
            
            res.json(rows);
        }else{
            console.log(err);
        }
    });
});




module.exports = router;