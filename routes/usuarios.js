
const { Router }= require('express');
const { check } = require('express-validator');

// const { validarCampos } = require('../middlewares/validar-campos');
// const { validarJWT } = require('../middlewares/validar-jwt');
// const { esAdminRole,tieneRole } = require('../middlewares/validar-roles');
//TODO exportación de los middleware en una sola variable (index.js)
const {validarCampos,
        validarJWT,
        esAdminRole,
        tieneRole} = require('../middlewares')


const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');

const { usuariosGet, 
        usuariosPut, 
        usuariosPost, 
        usurariosDelete, 
        usuariosPatch } = require('../controllers/usuarios');

const router = Router();

router.get('/', usuariosGet );

router.put('/:id',[
        check('id','No es un ID válido').isMongoId(),
        check('id').custom(existeUsuarioPorId),
        check('rol').custom( esRoleValido ),
        validarCampos,
], usuariosPut);

router.post('/',[
        check('nombre','El nombre es obligatorio').not().isEmpty(),
        check('password','El password es obligatorio y más de 6 letras').isLength({ min: 6}),
        check('correo','El correo no es valido').isEmail(),
        check('correo',).custom(emailExiste),
        // check('rol','No es un rol válido').isIn(['ADMIN_ROLE','USER_ROLE']),
        check('rol').custom( esRoleValido ),
        validarCampos,
],usuariosPost);

router.delete('/:id',[
        validarJWT,
        esAdminRole, //ESTE MIDDLEWARE FUERZA A QUE EL USUARIO SEA ADMIN
        tieneRole('ADMIN_ROLE','USER_ROLE','VENTAS_ROLE'),
        check('id','No es un ID válido').isMongoId(),
        check('id').custom(existeUsuarioPorId),
        validarCampos,
],usurariosDelete);


router.patch('/',usuariosPatch);






module.exports = router;




