
const { Router }= require('express');
const { usuariosGet, 
        usuariosPut, 
        usuariosPost, 
        usurariosDelete, 
        usuariosPatch } = require('../controllers/usuarios');

const router = Router();

router.get('/', usuariosGet );

router.post('/',usuariosPost);

router.put('/:id', usuariosPut);

router.patch('/',usuariosPatch);

router.delete('/',usurariosDelete);





module.exports = router;




