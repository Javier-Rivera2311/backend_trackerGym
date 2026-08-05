import cors from 'cors';
import path from 'path';
import morgan from 'morgan';
import express from 'express';
import helmet from 'helmet'; // NUEVO: Cabeceras de seguridad
import xss from 'xss-clean'; // NUEVO: Sanitización contra scripts maliciosos
import rateLimit from 'express-rate-limit'; // NUEVO: Protección contra fuerza bruta y spam

import value from './const/const.js';
// Archivo de la configuración de bd 
import './database/connection.js';

const app = express(); // crear instancia app

const corsOptions = {
    credentials: true,
    optionSuccessStatus: 200,
    methods: "GET, PUT, POST, DELETE",
    origin: '*'
};

app.set('env', value.NODE_ENV);
app.set('port', value.RUN_PORT);

// ==========================================
// 1. CABECERAS DE SEGURIDAD (Siempre arriba)
// ==========================================
// Helmet oculta detalles técnicos de Express y asegura las respuestas HTTP
app.use(helmet());

// ==========================================
// 2. RATE LIMITING (Límite de peticiones)
// ==========================================
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 150, // Límite de 150 peticiones por IP cada 15 minutos
    message: {
        success: false,
        error: 'Demasiadas peticiones desde esta IP, por favor intenta más tarde.'
    }
});
// Aplicamos el limitador a todas las rutas por defecto
app.use(limiter);

// ==========================================
// 3. MIDDLEWARES ESTÁNDAR
// ==========================================
app.use(morgan('dev'));
app.use(cors(corsOptions));

// Parsea el body (Ajustado el límite por seguridad)
app.use(express.json({ limit: '50MB' })); 
app.use(express.urlencoded({ extended: true, limit: '50MB' }));

// ==========================================
// 4. PROTECCIÓN XSS (Debe ir después del body parser)
// ==========================================
// Limpia cualquier etiqueta <script> inyectada en el body, query o params
app.use(xss());

// ==========================================
// 5. ARCHIVOS ESTÁTICOS
// ==========================================
app.use(express.static(path.join(path.resolve(), value.STATIC_PATH)));

// ==========================================
// 6. ENDPOINTS / RUTAS
// ==========================================
import routerUser from './routes/user.js';
// import routerRutas from './routes/rutas.js';

/* `app.use('/user', routerUser)` is setting up a middleware for the Express.js application. */
app.use('/user', routerUser);
// app.use('/rutas', routerRutas);

export default app;