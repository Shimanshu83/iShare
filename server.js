const express = require('express');     
require('dotenv').config() ; 
const path = require('path');

const connectDB = require('./config/db');
const fileRouter = require('./router/file');


const app = express();

app.use(express.urlencoded({extended : true}));
app.use(express.json())

app.set('view engine', 'ejs');

//setting static file 
app.use(express.static(path.join(__dirname , 'public')));

//All router will be here                      
app.use('/api/files', fileRouter) ; 

app.use('/files/download' , require('./router/download'));

app.use('/files', require('./router/show'));



app.use('/' , (req , res )=>{
    res.render('file_upload');
})

// Datbase connection 
connectDB() ; 

const PORT  = process.env.PORT || 3000 ; 

app.listen(PORT ,()=>{
    console.log(`listening on port ${PORT}`);
})