/* 
  Este archivo maneja las rutas relacionadas con los usuarios.
*/
import { Router } from 'express';
import { verifyToken } from '../middleware/auth.js';

// Importa los controladores que creamos para Supabase
// (Ajusta './login.js' o './user.js' dependiendo de dónde guardaste las funciones)
import { registerUser, loginUser } from '../controllers/login.js'; 

// 1. Inicializamos el enrutador
const router = Router();

// ==========================================
// RUTAS PÚBLICAS (No requieren token)
// ==========================================

// POST: http://localhost:5000/user/registro
router.post('/registro', registerUser);

// POST: http://localhost:5000/user/login
router.post('/login', loginUser);


// 2. Exportamos el enrutador por defecto (Esto es lo que evita el Crash)
export default router;