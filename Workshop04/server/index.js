require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// rutas de cursos y profes
const courseRoutes = require('./routes/courseRoutes');
const teacherRoutes = require('./routes/teacherRoutes');

const mongoString = process.env.DATABASE_URL;
mongoose.connect(mongoString);
const database = mongoose.connection;


database.on('error', (error) => {
    console.log(error)
});

database.once('connected', () => {
    console.log('Database Connected');
});

//instancia de express: representa mi servidor web pra: configurar rutas, middlewares, servir achivos estaticos e iniciar el servidor
const app = express();

//middlewares
app.use(bodyParser.json()); //convierte las peticiones en json
app.use(cors({    //para permitirle a mi cliente (frontend) hacer peticiones
  domains: '*',
  methods: '*'
}));

//path de node ayuda a trabajar con rutas de archivos
const path = require('path'); 
app.use(express.static(path.join(__dirname, '../client'))); //dirname: el directorio actual

//Aqui se le dice al servidor que todas las rutas definidas en courseRoutes se prefijan con /course y teacherRoutes con /teacher
app.use('/course', courseRoutes);
app.use('/teacher', teacherRoutes);

app.listen(process.env.PORT, () => console.log(`Escuchando el puerto ${process.env.PORT}!`))