const { response } = require("express");
const { ObjectId } = require('mongoose').Types;

const { Usuario,Categoria,Producto } = require('../models');

const coleccionesPermitidas = [
    'usuario',
    'categorias',
    'productos',
    'roles'
]
//todo *******************************************************************
//?               ***********    Buscar Usuario   ******************
//todo *******************************************************************

const buscarUsuarios = async( termino = '', res=response )=>{

        const esMongoID = ObjectId.isValid( termino ) // devuelve true si es un id de mongo

            if( esMongoID){
                const usuario = await Usuario.findById( termino );
                return res.json( {
                    results: ( usuario ) ? [usuario] : []
                } )
            }

            // ? Expresión regular
            const regex = new RegExp( termino,'i' )// insensible a las mayúsculas y a las minúsculas

            const usuarios = await Usuario.find({ 
                $or: [{nombre: regex},{ correo: regex }],
                $and:[{ estado: true}]
            });

            const totalUsuarios = await Usuario.count({ 
                $or: [{nombre: regex},{ correo: regex }],
                $and:[{ estado: true}]
            });
            
            res.json( {
                msg: `Total Elementos: ${totalUsuarios}`,
                results: usuarios,
            });
    }
//todo *******************************************************************
//?               ***********    Buscar Categoría   ******************
//todo *******************************************************************


const buscarCategorias =  async( termino='',res=response )=>{

    const esMongoID = await ObjectId.isValid( termino )

    if( esMongoID){
        const categoria = await Categoria.findById( termino );
        return res.json( {
            results: ( categoria ) ? [categoria] : []
        } )
    }

        // ? Expresión regular
        const regex = new RegExp( termino,'i' )// insensible a las mayúsculas y a las minúsculas

        const categoria = await Categoria.find({nombre: regex, estado: true});

        res.json( {
            results: categoria,
        });
}
//todo *******************************************************************
//?               ***********    Buscar Producto   ******************
//todo *******************************************************************

const buscarProductos = async( termino='', res=Response)=>{
    const esMongoID = await ObjectId.isValid( termino )

    if( esMongoID){
        const producto = await Producto.findById( termino )
                            .populate('categoria','nombre');
        return res.json( {
            results: ( producto ) ? [producto] : []
        } )
    }

            // ? Expresión regular
            const regex = new RegExp( termino,'i' )// insensible a las mayúsculas y a las minúsculas

            const producto = await Producto.find({nombre: regex, estado:true})
                                .populate('categoria','nombre');
            res.json( {
                results: producto,
            });

}

//todo *******************************************************************


const buscar = (req, res = response)=>{

    const {coleccion, termino} = req.params;

    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`
        });
    }



    switch(coleccion){
        case 'usuario':
                buscarUsuarios(termino,res);
        break;
        case 'categorias':
                buscarCategorias(termino,res);
        break;
        case 'productos':
                buscarProductos(termino,res);
        break;

        default:
            res.status(500).json({
                msg: 'Se me olvido hacer esta búsqueda'
            })
    }

}




module.exports = {
    buscar,
}