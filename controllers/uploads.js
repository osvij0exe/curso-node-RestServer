const path = require('path')
const { v4: uuidv4 } = require('uuid');


const { response } = require("express");

const cargarArchivos =(req, res =response)=>{



    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        res.status(400).json('No hay archivos que subir');
        return;
    }


    const {archivo } = req.files;
    const nombreCortado = archivo.name.split('.');
    //extension del archivo(png,txt,etc)
    const extension = nombreCortado[nombreCortado.length - 1];

    // validar la extension
    const extenionesValidas = ['png','jpg','jpeg','gif'];
    if( !extenionesValidas.includes( extension ) ){
        return res.status(400).json({
            msg: `La extensión ${ extension } no es permitida, extensiones permitidas: ${ extenionesValidas}`
        })
    }




    const nombreTemp = uuidv4() + '.' + extension;
    const uploadPath = path.join(__dirname,  '../uploads/', nombreTemp);

    archivo.mv(uploadPath,(err)=> {
        if (err) {
            return res.status(500).json({ err });
    }

    res.json({msg: 'File uploaded to ' + uploadPath});
    });

}



module.exports = {

    cargarArchivos
}
