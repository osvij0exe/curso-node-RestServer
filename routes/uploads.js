const { Router }= require('express');
const { check } = require('express-validator');

const { validarCampos, validarArchivoSubir } = require('../middlewares');
const { cargarArchivos, actualizarImagen, mostrarImagen, actualizarImagenCloudinary } = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers');



const router = Router();

// post para crear un archivo nuevo
//todo crear validaciones
router.post('/',validarArchivoSubir,cargarArchivos);


router.put('/:coleccion/:id', [
    validarArchivoSubir,  
    check('id','El id debe ser de mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c,[ 'usuarios','productos' ] ) ),
    validarCampos,
], actualizarImagenCloudinary);
//? la función de abajo es solo para fines educativos
// ], actualizarImagen);


router.get('/:coleccion/:id',[
    check('id','El id debe ser de mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c,[ 'usuarios','productos' ] ) ),
    validarCampos,
], mostrarImagen)



module.exports = router;






