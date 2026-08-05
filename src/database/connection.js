import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Cargar las variables de entorno (tu archivo .env)
dotenv.config();

// Obtener las credenciales desde el .env
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

/*
  Validación de seguridad opcional:
  Asegura que el servidor no arranque si faltan las credenciales
*/
if (!supabaseUrl || !supabaseKey) {
    console.error('Error: Faltan las credenciales de Supabase en el archivo .env');
    process.exit(1);
}

// Crear y exportar el cliente de conexión
export const supabase = createClient(supabaseUrl, supabaseKey);

console.log('✅ Cliente de Supabase inicializado correctamente.');