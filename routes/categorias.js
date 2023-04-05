const { Router }= require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');


const { crearCategoria,
        obtenerCategorias, 
        obtenerCategoria, 
        actualizarCategoria, 
        BorrarCategoria} = require('../controllers/categorias');
const { existeCategoriaPorId } = require('../helpers/db-validators');


const router = Router();

/**
 * {{url}}/api/categorías
 */

//obtener todas las categorías - publico -

router.get('/',obtenerCategorias)

// obtener una categoría por id - publico

router.get('/:id',[
    check('id','no es un id de Mongo válido').isMongoId(),
    validarCampos,
    check('id').custom( existeCategoriaPorId ),
    validarCampos,
],obtenerCategoria);

// crear categoría - privado - cualquier con un token valido

router.post('/',[
    validarJWT,
    check('nombre','el nombre es obligatorio').not().isEmpty(),
    validarCampos,
],crearCategoria);


// actualizar un registro - privado -cualquiera con un token valido

router.put('/:id',[
    validarJWT,
    check('nombre','el nombre es obligatorio').not().isEmpty(),
    check('id','no es un id de Mongo válido').isMongoId(),
    validarCampos,
    check('id').custom( existeCategoriaPorId ),
    validarCampos,
],actualizarCategoria)

// eliminar un registro - privado -cualquiera con un token valido

router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id','no es un id de Mongo válido').isMongoId(),
    validarCampos,
    check('id').custom( existeCategoriaPorId ),
    validarCampos,
],BorrarCategoria)


module.exports = router;

