const express = require('express');
const router = express.Router();
const fileModel = require('./../model/file');

router.get('/:uuid' , async (req , res) => {
    
    try{ 

        const file =await fileModel.findOne({uuid : req.params.uuid});
        
        if(!file){
            return res.render('download', {error:"the link had expired"});
        }

        return res.render('download',{

            uuid : file.uuid,  
            fileName : file.filename ,  
            fileSize : file.size ,  
            downloadLink : `${process.env.APP_BASE_URL}/files/download/${file.uuid}`
        })

    }
    catch(err){
        return res.render('download' , {error : 'Something went wrong'});
    }
})

module.exports = router ; 