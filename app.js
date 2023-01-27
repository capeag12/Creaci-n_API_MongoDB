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

app.get('/buscarcontacto',(req,res)=>{
    let objectId = req.query.id
    if (!objectId) {
        res.send("Error")
    } else{
        try{
            let obID = mongodb.ObjectId(objectId)
            let recibido = db.collection('contactos').findOne({"_id":obID}).then((result) => {
                if (!result.dni) {
                   return res.send('404')
                }
                else{
                   return res.send(result)
                }
            }).catch((err) => {
                return res.send('404')
            }); 
            
        }
        catch{
            return res.send("Error, el objectId no tiene el formato correcto")
        }
        
        
        
    }

})

app.put('/actualizarcontacto',(req,res)=>{
    let objectId = req.query.id
    if (!objectId) {
        return res.send("Error")
    }
    console.log(req.body)
    if (req.body) {
        try{
            let obID = mongodb.ObjectId(objectId)
            let recibido = db.collection('contactos').updateOne({"_id":obID},{ $set: req.body }).then((result) => {
                console.log(result)
                if (result.modifiedCount>0) {
                    return res.send("Se han modificado"+result.modifiedCount+" objetos")
                }
                
                
            }).catch((err) => {
                return res.send('Ha fallado')
            }); 
            
        }
        catch{
            return res.send("Error, el objectId no tiene el formato correcto")
        }
    }
    else{
        return res.send("Debes enviar un body")
        
        
        
    }
})

app.delete('/eliminarcontacto', (req,res)=>{
    let objectId = req.query.id
    if (!objectId) {
        res.send("Error")
    } else{
        try{
            let obID = mongodb.ObjectId(objectId)
            let recibido = db.collection('contactos').deleteOne({"_id":obID}).then((result) => {
                if (result.deletedCount>0) {
                    return res.send("Eliminado correctamente")
                }
                else{
                    return res.send("No se pudo eliminar")
                }
                
                
            }).catch((err) => {
                return res.send('Ha fallado')
            }); 
            
        }
        catch{
            return res.send("Error, el objectId no tiene el formato correcto")
        }
        
        
        
    }

})

app.listen(3000, ()=>{
    console.log("El server está encendido")
})