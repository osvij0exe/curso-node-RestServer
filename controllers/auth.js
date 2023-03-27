const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');


const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');

const login = async(req,res) =>{

    const { correo,password } = req.body;

    try{

        // verificar si el email existe
        const usuario = await Usuario.findOne({ correo })
        if(!usuario){
            return res.status(400).json({
                msg:'Usuario / Password no son correctos - correo'
            });
        }
        //si el usuario está activo
        if(!usuario.estado){
            return res.status(400).json({
                msg:'Usuario / Password no son correctos - estado:false'
            });
        }

        //verificar la contraseña

        const validPassword = bcrypt.compareSync(password, usuario.password);
        if(!validPassword){
            return res.status(400).json({
                msg:'Usuario / Password no son correctos - password'
            });
        }

        //generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
    
        })

    }catch (error){
        console.log(error)
        res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }

}

const googleSingIn = async(req,res = response) =>{

    const { id_token } = req.body;

    try{

        const { correo, nombre, img  } = await googleVerify(id_token);

        // Generar la referencia para verificar si el email ya existe
        let usuario = await Usuario.findOne({correo});

        if( !usuario ){
            //tengo que crearlo si no existe
            const data = {
                nombre,
                correo,
                rol:'USER_ROLE',
                password: ':p',
                img,
                google: true,
            };

            usuario = new Usuario( data );
            await usuario.save();
        }

        //si el usuario en BD tiene el estado en false (google)
        
        if(!usuario.estado){
            return res.status(400).json({
                msg:'Hable con el administrador, usuario bloqueado',
            });
        }

        // Generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token,

        })
    

    }catch(err){
        res.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar'
        })
    }



}



module.exports = {
    login,
    googleSingIn
}


