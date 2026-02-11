require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Teacher = require('./models/teacher');

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


app.use(express.static('client'));


//routes
app.post('/Teacher', async (req, res) => {
    const teacher = new Teacher({
        name: req.body.name,
        lastname: req.body.lastname,
        age: req.body.age,
        cedula: req.body.cedula
    })

    try {
        const teacherCreated = await teacher.save();
        res.header('Location', `/teacher?id=${teacherCreated._id}`);
        res.status(201).json(teacherCreated)
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
});

app.get('/teacher', async (req, res) => {
    try{
        if(!req.query.id){
            const data = await Teacher.find();
            return res.status(200).json(data)
        }
        const data = await Teacher.findById(req.query.id);
        res.status(200).json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

app.put('/teacher', async (req, res) => {
    try{
        const teacher = await Teacher.findByIdAndUpdate(
            req.query.id,
            {
                name: req.body.name,
                lastname: req.body.lastname,
                age: req.body.age,
                cedula: req.body.cedula
            },
            { new: true }
        );
        
        if(!teacher){
            return res.status(404).json({message: 'Profesor no encontrado'})
        }
        
        res.status(200).json(teacher)
    }
    catch(error){
        res.status(400).json({message: error.message})
    }
})

app.delete('/teacher', async (req, res) => {
    try{
        const teacher = await Teacher.findByIdAndDelete(req.query.id);
        return res.status(204).json({message: 'Profesor eliminado exitosamente'})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

app.listen(process.env.PORT, () => console.log(`Escuchando el puerto ${process.env.PORT}!`))