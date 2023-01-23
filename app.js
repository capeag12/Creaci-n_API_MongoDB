const express = require('express')
const app = express()
const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

const urlConexion = 'mongodb://127.0.0.1:27017'
const nombredb = 'ListaContactos'
app.use(express.json())
let db

MongoClient.connect(urlConexion,{ useNewUrlParser: true }, (err, client)=>{
    if (err) {
        return console.log("Imposible conectar")
    }

    db = client.db(nombredb)

    

})

app.post('/crearcontacto',(req,res)=>{
    let json = req.body
    let dni = json.dni
    let nombre = json.nombre
    let edad = json.edad
    let tlfn = json.telefono

    if (!dni || !nombre || !edad || !tlfn) {
        res.send("Error")
    } else{
        db.collection('contactos').insertOne({
            dni: dni, nombre: nombre, edad:edad, telefono:tlfn
        })    
        res.send("recibido"+dni+" "+nombre+" "+edad+" "+tlfn)
    }

    

})

app.listen(3000, ()=>{
    console.log("El server está encendido")
})