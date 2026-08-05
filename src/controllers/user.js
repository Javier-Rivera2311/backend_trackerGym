import mysql2 from 'mysql2/promise';
import connectionConfig from '../database/connection.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const createConnection = async ( ) => {
    return await mysql2.createConnection(connectionConfig);
}

const getUsuarios = async (req, res) => {
  try {
    const connection = await createConnection();

    const [rows] = await connection.execute(`
      SELECT 
        w.*, 
        d.name_dep AS department_name 
      FROM 
        Workers w
      LEFT JOIN 
        Department d ON w.department_id = d.ID
    `);

    await connection.end();

    return res.status(200).json({
      success: true,
      usuarios: rows
    });

  } catch (error) {
    return res.status(500).json({
      status: false,
      error: "Problemas al traer los usuarios",
      code: error
    });
  }
};

const getDepartmentsForRegister = async (req, res) => {
  try {
    const connection = await createConnection();
    const [departments] = await connection.execute('SELECT ID, name_dep FROM Department');
    await connection.end();

    return res.status(200).json({
      success: true,
      departments
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Error al obtener los departamentos',
      code: error
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { email, password, edad, altura, peso, exercise_level } = req.body;

    // Comprobar que el correo electrónico y la contraseña están presentes
    if (!email || !password) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    const connection = await createConnection();
    const [rows] = await connection.execute('SELECT * FROM userapp WHERE email = ?', [email]);

    if (rows.length === 1) {
      const user = rows[0];

      // Verificar la contraseña
      const passwordIsValid = await bcrypt.compare(password, user.password);
      if (!passwordIsValid) {
        await connection.end();
        return res.status(401).json({ success: false, error: 'Contraseña incorrecta' });
      }

      // Actualizar solo los campos que se proporcionaron
      const fieldsToUpdate = { edad, altura, peso, exercise_level };
      for (const field in fieldsToUpdate) {
        if (fieldsToUpdate[field] !== undefined) {
          await connection.execute(`UPDATE userapp SET ${field} = ? WHERE email = ?`, [fieldsToUpdate[field], email]);
        }
      }

      await connection.end();

      return res.status(200).json({
        success: true,
        message: "Información del usuario actualizada con éxito"
      });
    } else {
      await connection.end();
      return res.status(401).json({
        success: false,
        error: "Usuario no encontrado"
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      error: "Problemas al actualizar la información del usuario",
      code: error
    });
  }
}

const getDepartamentosUsuarios = async (req, res) => {
  try {
    // Obtener el token del header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, error: 'No token' });

    // Decodificar el token
    const decoded = jwt.verify(token, 'secret-key');
    const userId = decoded.id;

    const connection = await createConnection();

    // Buscar SOLO los departamentos del usuario autenticado
    const [rows] = await connection.execute(`
      SELECT 
        ID, Name, department_id 
      FROM 
        Workers
      WHERE
        ID = ?
    `, [userId]);

    await connection.end();

    return res.status(200).json({
      success: true,
      departamentos: rows
    });

  } catch (error) {
    return res.status(500).json({
      status: false,
      error: "Problemas al traer los department_id de los usuarios",
      code: error
    });
  }
};

const getCategory = async (req, res) => {
  try {
    const connection = await createConnection();

    const [rows] = await connection.execute(`
      SELECT * FROM Category
    `);

    await connection.end();

    return res.status(200).json({
      success: true,
      meetings: rows
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Error al obtener las categorias",
      code: error
    });
  }
};


export {
    getUsuarios,
    updateUser,
    getDepartmentsForRegister,
    getDepartamentosUsuarios,
    getCategory,
}
