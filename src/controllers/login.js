import { supabase } from '../database/connection.js';

// ==========================================
// REGISTRO DE USUARIO (SIGN UP)
// ==========================================
export const registerUser = async (req, res) => {
  try {
    const { email, password, nombre } = req.body;

    // Validación básica
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'El email y la contraseña son obligatorios' 
      });
    }

    // Creación del usuario en Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          nombre: nombre // Guarda información extra en la metadata del usuario
        }
      }
    });

    if (error) throw error;

    return res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      user: data.user // Retorna los datos básicos del usuario creado
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Error al registrar el usuario',
      code: error.message
    });
  }
};

// ==========================================
// INICIO DE SESIÓN (LOGIN)
// ==========================================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validación básica
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'El email y la contraseña son obligatorios' 
      });
    }

    // Autenticación con Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    });

    if (error) throw error;

    return res.status(200).json({
      success: true,
      message: 'Inicio de sesión exitoso',
      token: data.session.access_token, // Este es el JWT que tu frontend debe guardar
      user: data.user // Información del usuario logueado
    });

  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Credenciales inválidas',
      code: error.message
    });
  }
};