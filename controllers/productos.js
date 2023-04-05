const { response } = require("express");
const { Producto } = require('../models')


// obtenerProducto - paginado - total - populate

const obtenerProductos = async(req,res=response) =>{

    const { limite = 5, desde = 0 } =req.query;//tratar de validar que sea número
    const query = {estado: true};



    const [total,productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
        .populate('usuario','nombre')
            .skip(Number(desde))               //coleción de las promesas
            .limit(Number(limite)),
    ])

    res.json({
        total,
        productos,
    });


}

// obtenerProducto - populate {}

const obtenerProducto = async(req,res = response)=>{

    const{ id } = req.params;
    const producto = await Producto.findById(id)
                            .populate('usuario','nombre')

    res.json( producto );
}

// crear producto

const crearProducto = async(req,res=response) =>{

    const {estado,usuario, ...body} = req.body;

    const productoDB = await Producto.findOne( {nombre: body.nombre} )

    if( productoDB ){
        return res.status(400).json({
            msg: `el producto ${productoDB.nombre}, ya existe`,
        })
    }

    //generar la DATA a guardar
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id,

        }

        const producto = new Producto( data );

        // Guardar en DB
        await producto.save();

        res.status(201).json( producto );


}



// actualizarProducto


const actualizarProducto = async(req,res = response)=>{

    const { id } = req.params;
    const { estado,usuario, ...data } = req.body;

    if( data.nombre ){
        
        data.nombre = data.nombre.toUpperCase();
    }
    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate( id, data, { new:true } );

    res.json(producto);

}

// BorrarProducto - estado: false

const BorrarProducto = async(req, res= response)=>{

    const { id } = req.params;
    const productoBorrado = await Producto.findByIdAndUpdate( id,{ estado:false },{ new:true } )

    res.json( productoBorrado );
}


module.exports={
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    BorrarProducto

}
