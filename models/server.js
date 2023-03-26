
const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');


class Server {

    constructor(){
        this.app  = express()
        this.port = process.env.PORT,

        this.usuariosPath = '/api/usuarios';
        this.authPath     = '/api/auth';

    /*****************************************************************************/  
        //?Conectar a base de datos
    /*****************************************************************************/  

        this.conectarDB();
    /*****************************************************************************/  
        //?MIDDLEWARE
    /*****************************************************************************/  

        this.middlewares();

    /*****************************************************************************/  
    //?RUTAS DE MI APLICACIÓN
    /*****************************************************************************/  

        this.routes();
    
        
    /*****************************************************************************/          
        //?MÉTODOS
    /*****************************************************************************/  

    }
    //método conexión de base de datos
    async conectarDB(){
        await dbConnection();
    }
        
    
    middlewares(){

        //CORS
        this.app.use(cors());

        //Lectura y parseo del body
        this.app.use(express.json());

        //Directorio publico 
        this.app.use( express.static('public') )
    }
    /*****************************************************************************/  
    //?ENDPOiNTS
    /*****************************************************************************/  

    routes(){
        this.app.use(this.authPath,require('../routes/auth'));
        this.app.use(this.usuariosPath,require('../routes/usuarios'));

    }

    listen(){
        this.app.listen(this.port,()=>{
            console.log('servidor corriendo en el puerto',this.port);
        });
    }
}




module.exports = Server;
