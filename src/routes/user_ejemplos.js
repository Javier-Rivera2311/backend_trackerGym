/* 
Este archivo muestra ejemplos base para la creación de rutas usando Express.
Se utiliza el objeto Router para agrupar endpoints relacionados y mantener el código ordenado.
*/
import { Router } from 'express';

// Importación de middleware (interceptores)
import { verifyToken } from '../middleware/auth.js';

// Importación de controladores (la lógica que se ejecuta en cada ruta)
import { getUsuarios, setUsuario } from '../controllers/user.js';
import { updateContact, deleteContact } from '../controllers/contact.js';
import { createTicket, getMyTickets } from '../controllers/ticket.js';
import { getProposalById, updateProposal, deleteProposal } from '../controllers/proposals.js';

const router = Router();

// Ejemplo 1: Rutas básicas encadenadas (Misma URL, distintos métodos)
router.route('/usuarios')
    .get(getUsuarios)    // GET: Obtiene la lista de usuarios
    .post(setUsuario);   // POST: Registra un nuevo usuario

// Ejemplo 2: Rutas con parámetros dinámicos en la URL (el ":id")
router.route('/contacto/:id')
    .put(updateContact)    // PUT: Actualiza el contacto que coincida con el ID
    .delete(deleteContact); // DELETE: Elimina el contacto que coincida con el ID

// Ejemplo 3: Rutas protegidas con Middleware (verifyToken)
router.route('/tickets/mis-tickets')
    .get(verifyToken, getMyTickets); // Primero verifica el token, si es válido, obtiene los tickets

router.route('/tickets/crear')
    .post(verifyToken, createTicket); // Protege la creación de un ticket

// Ejemplo 4: Ruta completa con múltiples métodos y middleware
router.route('/propuestas/:id')
    .get(verifyToken, getProposalById)   // Obtiene una propuesta específica
    .put(verifyToken, updateProposal)    // Modifica esa propuesta
    .delete(verifyToken, deleteProposal); // Elimina esa propuesta

export default router;