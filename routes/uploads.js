const { Router }= require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { cargarArchivos } = require('../controllers/uploads');



const router = Router();

// post para crear un archivo nuevo
//todo crear validaciones
router.post('/',cargarArchivos);





module.exports = router;






