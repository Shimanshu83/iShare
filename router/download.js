const express = require('express');
const router = express.Router() ; 
const fileModel = require('./../model/file')


router.use('/:uuid', async (req , res ) => {

 try{
     
    const file =await fileModel.findOne({uuid : req.params.uuid});
        
    if(!file){
        return res.render('download', {error:"the link had expired"});
    }
    const filePath = `${__dirname}/../uploads/${file.fileName}`

    return res.download(filePath);

 }   
 catch(err){
    console.log(err)
    return res.json({
        err : err 
    })
 }
})


module.exports = router ; 