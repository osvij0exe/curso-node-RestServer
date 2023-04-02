const {response, request} = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');



const usuariosGet = async(req =request, res = response) =>{

    // (Referencia)const { q,nombre='no name',apikey,page = 1,limit } = req.query;
    const { limite = 5, desde = 0 } =req.query;//tratar de validar que sea número
    const query = {estado: true};

/* ? REFERENCIA
    const usuarios = await Usuario.find(query)
    .skip(Number(desde))// desde que registro iniciar
    .limit(Number(limite));// para obtener el numero de registros 5 por default por la constante
    
    const total = await Usuario.countDocuments(query);
*/

    const [total,usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(Number(desde))               //coleción de las promesas
            .limit(Number(limite)),
    ])

    res.json({
        total,
        usuarios,
    });
}

const usuariosPost = async (req, res = response) =>{



    const {nombre, correo,password,rol} = req.body;
    const usuario = new Usuario( {nombre,correo,password,rol} );



    //Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync( password,salt );

    //Guardar en DB los datos
    await usuario.save();


    res.json({
        usuario
    });
}

const usuariosPut = async(req, res = response) =>{

    const {id} = req.params; 
    const {_id, password, google, correo,...resto} = req.body


    if(password){
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password,salt);
    }
    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json({usuario,});
}

const usuariosPatch = (req, res = response) =>{
    res.json({
        msg:'patch API - controlador',
    });
}
const usurariosDelete = async(req, res = response) =>{

    const { id } = req.params;

    const usuario = await Usuario.findByIdAndUpdate(id,{estado: false});

    res.json(usuario);
}


module.exports= {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usurariosDelete,
}
