const { Router } = require('express');
const { check, checkSchema } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');

const { crearProducto,
    obtenerProductos,
    obtenerProducto, 
    actualizarProducto, 
    BorrarProducto} = require('../controllers/productos');


const { validarJWT, esAdminRole } = require('../middlewares');
const { existeCategoriaPorId, existeProductoPorId } = require('../helpers/db-validators');

const router = Router();


//obtener todos los productos - publico

router.get('/',obtenerProductos)

//obtener un producto por id- publico -

router.get('/:id',[
    check('id','no es un id de Mongo válido').isMongoId(),
    validarCampos,
    check('id').custom( existeProductoPorId ),
    validarCampos,
],obtenerProducto)

//crear un producto - privado -cualquiera con un token valido

router.post('/',[
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('categoria','No es un id de Mongo').isMongoId(),
    validarCampos,
    check('categoria').custom( existeCategoriaPorId ),
    validarCampos,
],crearProducto)


//actualizar un registro - privado - cualquiera con un token valido

router.put('/:id',[    
    validarJWT,
    check('nombre','el nombre es obligatorio').not().isEmpty(),
    check('categoria','No es un id de Mongo, se requiere id de la categoria').isMongoId(),
    validarCampos,
    check('id').custom( existeProductoPorId ),
    validarCampos,],actualizarProducto)

//eliminar un registro - privado -cualquiera con un token valido

router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id','no es un id de Mongo válido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos,
],BorrarProducto)



module.exports = router;