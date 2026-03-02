require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { authenticateToken, generateToken, register } = require('./Controllers/auth.js');
const mongoose = require('mongoose');


const mongoString = process.env.DATABASE_URL;
mongoose.connect(mongoString);
const database = mongoose.connection;


database.on('error', (error) => {
    console.log(error)
});

database.once('connected', () => {
    console.log('Database Connected');
});

//instancia de express: representa mi servidor web pra: configurar rutas, middlewares, servir archivos estaticos e iniciar el servidor
const path = require('path');
const app = express();


// Servir archivos estáticos de la carpeta client
app.use(express.static(path.join(__dirname, '../client')));

//middlewares
app.use(bodyParser.json());
app.use(cors({
  domains: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));

// auth routes
app.post('/auth/register', register);
app.post('/auth/token', generateToken);

//routes
app.use('/api', authenticateToken, require('./routes/courseRoutes'));
app.use('/api', authenticateToken, require('./routes/teacherRoutes'));

app.listen(process.env.PORT, () => console.log(`Escuchando el puerto ${process.env.PORT}!`))