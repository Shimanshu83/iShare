const express = require('express');
const multer = require('multer');
const File = require('../model/file');
const path = require('path');
const {v4 : uuid4 } = require('uuid');

const router = express.Router() ; 























// File Upload
const fileStorage = multer.diskStorage({
    destination: 'uploads', // Destination to store image 
    filename: (req, file, cb) => {
        const uniqueName =`${Date.now()}-${Math.round(Math.random() * 1E9 )}${path.extname(file.originalname)}`;
        cb(null, uniqueName)
        // file.fieldname is name of the field (image), path.extname get the uploaded file extension
    }
});

const fileUpload = multer({
    storage: fileStorage,
    limits: {
        fileSize: 1000000 *100  // 1000000 Bytes = 100 MB
    }
    })  

router.post('/', fileUpload.single('file'), async(req, res) => {

    const file = new File({
        fileName : req.file.filename ,   
        uuid : uuid4(),
        path : req.file.path ,
        size : req.file.size   
    })

    try{
    const response = await file.save() ; 
    console.log(response);
    return res.status(200).send(`${process.env.APP_BASE_URL}/files/${response.uuid}`)
    }
    catch(err){
        console.log(err)
        return res.status(501).send('something went wrong');
    }
  
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})



router.post('/send' ,async (req , res )=>{
    console.log('I am in the file send throught emial router ');
    console.log(req.body)
    const {uuid , emailFrom, emailTo} = req.body ;
    console.log(uuid)

    if(!uuid || !emailFrom || !emailTo){
        return res.status(422).send({err : "All fields are required."});

    }

    const file = await File.findOne({uuid : uuid});

    if(!file){
        return res.status(422).send("the link had expired");
    }

    file.sender = emailFrom ;
    file.receiver = emailTo ;
    
    const response = await file.save();

    const sendMail = require('../services/emailService');

    sendMail({
        from : emailFrom,
        to : emailTo,
        subject : "iShare file sharing" ,  
        text : `${emailFrom} shared a file with you` , 
        html : require('../services/emailTemplate')({
            emailFrom : emailFrom,
            downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}`,
            size : parseInt(file.size/1000) + ' KB' , 
            expires : "24 hours"

        })
    })
    return res.send({
        sucess : true
    });


})


module.exports = router ; 