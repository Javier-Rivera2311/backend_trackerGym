import dotenv from 'dotenv';
dotenv.config();

/* Configuración general del servidor */
const SECRET = process.env.SECRET;
const RUN_PORT = process.env.RUN_PORT;
const NODE_ENV = process.env.NODE_ENV;
const STATIC_PATH = process.env.STATIC_PATH;

/* Credenciales de Supabase */
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

/* 
  Se crea el objeto con las constantes actuales.
*/
const object = {
    SECRET,
    RUN_PORT,
    NODE_ENV,
    STATIC_PATH,
    SUPABASE_URL,
    SUPABASE_ANON_KEY
};

// Object.freeze() congela el objeto para que no pueda ser modificado en otra parte del código
Object.freeze(object);

export default object;