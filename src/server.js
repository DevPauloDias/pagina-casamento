const express = require('express')
const app = express()


const port = process.env.PORT || 3000;


app.set('view engine', 'ejs' )

app.use(express.static('public'));

app.get('/', (req, res)=>{

    res.render('video')
})


app.post('/upload', (req, res)=>{
    console.log('enviando...')
})



app.listen(3000, ()=>{
    console.log(`servidor rodando na porta ${port}!`)
})