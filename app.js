require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');


const router = require("./api/routes/index")


//CARPETA PUBLIC
const publicPath = path.resolve(__dirname, "./public"); 
app.use(express.static(publicPath)); 

//SERVIDOR LEVANTADO
app.listen(process.env.PORT || 3000, () =>{
    console.log("http://localhost:3000");



}); 



//GUARDADO OBJETOS QUE VIENEN POR POST COMO OBJETOS LITERALES EN JSON
app.use(express.urlencoded({ extended: false }));
app.use(express.json()); 

//METODOS PUT Y DELETE
const methodOverride = require('method-override');
app.use(methodOverride('_method')); 

//ENRUTADORES
app.use("/", router);