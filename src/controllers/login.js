import mysql2 from 'mysql2/promise';
import connectionConfig from '../database/connection.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const createConnection = async ( ) => {
    return await mysql2.createConnection(connectionConfig);
}

// Para el registro de usuario
const setUsuario = async (req, res) => {
  try {
    const {
      name,
      mail,
      password,
      confirmPassword,
      department_id,
    } = req.body;

    // Validar seguridad de la contraseña
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{6,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        error: 'La contraseña debe tener al menos una mayúscula, una minúscula, un número, un carácter especial y mínimo 6 caracteres.'
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        error: 'Las contraseñas no coinciden'
      });
    }

    const connection = await createConnection();

    // Validar si el correo ya existe (respetando "mail" exacto)
    const [existing] = await connection.execute(
      'SELECT * FROM Workers WHERE mail = ?',
      [mail]
    );

    if (existing.length > 0) {
      await connection.end();
      return res.status(400).json({
        success: false,
        error: 'El correo ya está registrado'
      });
    }

    // Verificar que el departamento exista
    const [depCheck] = await connection.execute(
      'SELECT * FROM Department WHERE ID = ?',
      [department_id]
    );

    if (depCheck.length === 0) {
      await connection.end();
      return res.status(400).json({
        success: false,
        error: 'Departamento inválido'
      });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar nuevo usuario (sin mail_personal)
    const [insertResult] = await connection.execute(
      'INSERT INTO Workers (Name, mail, password, department_id) VALUES (?, ?, ?, ?)',
      [name, mail, hashedPassword, department_id]
    );

    await connection.end();

    return res.status(200).json({
      success: true,
      message: 'Usuario registrado correctamente',
      insertId: insertResult.insertId
    });

  } catch (error) {
    console.error('Error al registrar usuario:', error);
    return res.status(500).json({
      success: false,
      error: 'Problemas al registrar usuario',
      code: error
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const connection = await createConnection();
    const [rows] = await connection.execute(
      'SELECT * FROM Workers WHERE mail = ?', 
      [email]
    );
    await connection.end();

    if (rows.length === 1) {
      const user = rows[0];

      // Comparar la contraseña ingresada con el hash almacenado
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        const token = jwt.sign({ id: user.ID }, 'secret-key', { expiresIn: '12h' });

        return res.status(200).json({
          success: true,
          message: "Inicio de sesión exitoso",
          token: token,
          name: user.Name,
          email: user.mail,
          department_id: user.department_id,
        });
      } else {
        return res.status(401).json({
          success: false,
          error: "Correo electrónico o contraseña incorrectos"
        });
      }
    } else {
      return res.status(401).json({
        success: false,
        error: "Correo electrónico o contraseña incorrectos"
      });
    }
  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({
      status: false,
      error: "Problemas al iniciar sesión",
      code: error
    });
  }
};

//cambiar la contraseña del usuario

const changePassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    const connection = await createConnection();
    const [rows] = await connection.execute('SELECT * FROM Workers WHERE mail = ?', [email]);

    if (rows.length === 1) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await connection.execute('UPDATE Workers SET password = ? WHERE mail = ?', [hashedPassword, email]);
      await connection.end();

      return res.status(200).json({
        success: true,
        message: "Contraseña actualizada con éxito"
      });
    } else {
      await connection.end();
      return res.status(401).json({
        success: false,
        error: "Correo electrónico no encontrado"
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      error: "Problemas al actualizar la contraseña",
      code: error
    });
  }
};

export{
    login,
    setUsuario,
    changePassword
}