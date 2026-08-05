import mysql2 from 'mysql2/promise';
import connectionConfig from '../database/connection.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const createConnection = async ( ) => {
    return await mysql2.createConnection(connectionConfig);
}


const encryptPlainPasswords = async (req, res) => {
  try {
    // (Opcional) protección básica con cabecera
    if (req.headers['x-admin-key'] !== 'A123JIRP.') {
      return res.status(401).json({ success: false, error: 'No autorizado' });
    }

    const connection = await mysql2.createConnection(connectionConfig);
    const [rows] = await connection.execute('SELECT ID, password FROM Workers');

    let actualizadas = 0;

    for (const user of rows) {
      const { ID, password } = user;

      // Si ya está encriptada, la saltamos
      if (password.startsWith('$2b$') || password.startsWith('$2a$')) {
        continue;
      }

      const hashed = await bcrypt.hash(password, 10);
      await connection.execute(
        'UPDATE Workers SET password = ? WHERE ID = ?',
        [hashed, ID]
      );
      actualizadas++;
    }

    await connection.end();

    return res.status(200).json({
      success: true,
      message: `Se encriptaron ${actualizadas} contraseñas en texto plano.`
    });
  } catch (error) {
    console.error('Error al encriptar contraseñas:', error);
    return res.status(500).json({
      success: false,
      error: 'Error al encriptar contraseñas',
      code: error
    });
  }
};

export {
    encryptPlainPasswords
}