const express = require('express')
const exphbs = require('express-handlebars')
const port = 3000
const hostname = '127.0.0.1'
const app = express()
// const sql = require('mssql/msnodesqlv8')
// var config = {
//     user: 'as',
//   password: 'ergen123',
//     database: 'öğrençibilgileriVT',
//     server:'DESKTOP-6UGG9OQ\\SQLEXPRESS',
//     driver: 'msnodesqlv8',
//     options:{
//         trustedConnection:true
//     }
// }

// async function ttyy() {
//     try {
//       let pool = await sql.connect(config);
//       let result = await pool.request().query('SELECT * FROM ogreciTable');
//       console.dir(result);
//     } catch (err) {
//       console.error(err);
//     }
//   }
//   ttyy();




app.use(express.static('public'))

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.get('/',(req,res)=>{
    res.render('site2/index')
})
app.get('/loginstation',(req,res)=>{
    res.render('site2/loginstation')
})

app.listen(port,hostname, ()=>{
    console.log(`Server Calışıyor, http://${hostname}:${port}`)
})