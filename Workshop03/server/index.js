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


const app = express();

//middlewares
app.use(bodyParser.json());
app.use(cors({
  domains: '*',
  methods: '*'
}));

//path de node ayuda a trabajar con rutas de archivos
const path = require('path'); 
app.use(express.static(path.join(__dirname, '../client'))); //dirname: el directorio actual

app.use('/course', courseRoutes);
app.use('/teacher', teacherRoutes);

app.listen(process.env.PORT, () => console.log(`Escuchando el puerto ${process.env.PORT}!`))