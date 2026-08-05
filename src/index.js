/* El código importa los módulos necesarios y los valores para ejecutar el servidor */
import 'dotenv/config.js';
import app from './app.js';
import value from './const/const.js';

/* 
  Se define la función principal usando un IIFE (Expresión de función ejecutada inmediatamente).
  Crea el servidor con app.listen() en el puerto definido en las variables de entorno.
*/
const main = (() => {
    const port = value.RUN_PORT || 5000;
    
    const server = app.listen(port, () => {
        console.log(`🚀 Servidor activo escuchando en el puerto ${port}`);
    });
    
    /* 
      OJO CON ESTO: 600000 ms son 10 minutos. 
      Es un tiempo de espera muy alto para una API REST normal.
    */
    server.timeout = 60000; 
})();