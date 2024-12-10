const express = require('express')
const app = express()
require('dotenv').config()
const bodyParser = require('body-parser');
const multer = require('multer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const path = require('path');

const port = process.env.PORT || 3000;

const serverUrl = process.env.SERVER_URL || "http://localhost:3000"

app.set('view engine', 'ejs' )

app.use(express.static('public'));


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



const upload = multer({ storage: multer.memoryStorage() });

const s3 = new S3Client({ region: process.env.AWS_REGION });
const bucketName = process.env.S3_BUCKET_NAME;


app.get('/', (req, res)=>{

  // res.render('video', {url: serverUrl})
   res.render('recado', {url: serverUrl})
})


app.post('/upload',upload.single('video') , async(req, res)=>{
    console.log('enviando...')
    try {

        if (!req.file) {
            return res.status(400).send('Nenhum arquivo enviado.');
        }

       
        const params = {
            Bucket: bucketName,
            Key: `videos/${Date.now()}-${req.file.originalname}`, // Caminho e nome do arquivo no S3
            Body: req.file.buffer, 
            ContentType: req.file.mimetype, 
        };

        const command = new PutObjectCommand(params);
        await s3.send(command);


        res.status(200).send("Vídeo enviado com sucesso!")

    } catch (error) {
        console.log(error)
        res.status(400).send("Falha ao enviar vídeo!")    
    }

    
})



app.listen(3000, ()=>{
    console.log(`servidor rodando na porta ${port}!`)
})