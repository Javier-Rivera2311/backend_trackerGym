import { supabase } from '../database/connection.js';

// ==========================================
// REGISTRO DE USUARIO (SIGN UP)
// ==========================================
export const registerUser = async (req, res) => {
  try {
    const { email, password, username, age, unit_preference } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email, contraseña y nombre de usuario son obligatorios' 
      });
    }

    // PASO 1: Crear la cuenta en el sistema de Auth de Supabase
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email,
      password: password
    });

    if (authError) throw authError;

    // PASO 2: Guardar el perfil en TU tabla "users" (la de la imagen)
    // Usamos el ID generado por el paso 1
    const { error: profileError } = await supabase
      .from('users') // El nombre exacto de tu tabla
      .insert([
        {
          id: authData.user.id, // El UUID de Supabase Auth
          email: email,
          username: username,
          age: age || null, // Si no lo envían, queda nulo
          unit_preference: unit_preference || null
        }
      ]);

    if (profileError) {
      // Si falla la creación del perfil, lo ideal sería avisar
      console.error("Error al crear perfil:", profileError);
      throw profileError;
    }

    return res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      user: authData.user 
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