const { response } = require("express");
const { Categoria } = require('../models')


// obtenerCategorías - paginado - total - populate

const obtenerCategorias = async(req,res=response) =>{

    const { limite = 5, desde = 0 } =req.query;//tratar de validar que sea número
    const query = {estado: true};



    const [total,categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
        .populate('usuario','nombre')
            .skip(Number(desde))               //coleción de las promesas
            .limit(Number(limite)),
    ])

    res.json({
        total,
        categorias,
    });


}

// obtenerCategoría - populate {}

const obtenerCategoria = async(req,res = response)=>{

    const{ id } = req.params;
    const categoria = await Categoria.findById(id)
                            .populate('usuario','nombre')

    res.json( categoria );
}



const crearCategoria = async(req,res=response) =>{

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne( {nombre} )

    if(categoriaDB){
        return res.status(400).json({
            msg: `la categoria ${categoriaDB.nombre}, ya existe`,
        })
    }

    //generar la DATA a guardar
    const data = {
        nombre,
        usuario: req.usuario._id,

        }

        const categoria = new Categoria( data );

        // Guardar en DB
        await categoria.save();

        res.status(201).json(categoria)


}



// actualizarCategoría


const actualizarCategoria = async(req,res = response)=>{

    const { id } = req.params;
    const { estado,usuario, ...data } = req.body;


    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate( id, data, { new:true } );

    res.json(categoria);

}

// BorrarCategoría - estado: false

const BorrarCategoria = async(req, res= response)=>{

    const { id } = req.params;
    const categoriaBorrada = await Categoria.findByIdAndUpdate( id,{ estado:false },{ new:true } )

    res.json( categoriaBorrada );
}


module.exports={
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    BorrarCategoria,
}
