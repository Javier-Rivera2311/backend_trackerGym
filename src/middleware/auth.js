import { supabase } from '../database/connection.js';

const verifyToken = async (req, res, next) => {
  // 1. Extraer el token del header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Espera formato "Bearer <token>"

  if (!token) {
    return res.status(403).json({ success: false, error: "Token no proporcionado" });
  }

  try {
    // 2. Usar el SDK de Supabase para validar el token
    const { data: { user }, error } = await supabase.auth.getUser(token);

    // 3. Manejar tokens inválidos, expirados o usuarios inexistentes
    if (error || !user) {
      return res.status(401).json({ success: false, error: "Token inválido o expirado" });
    }

    // 4. Inyectar los datos del usuario en la request
    req.user = user; 
    
    // 5. Continuar con el siguiente controlador
    next();
  } catch (err) {
    return res.status(500).json({ success: false, error: "Error en la autenticación" });
  }
};

export { verifyToken };