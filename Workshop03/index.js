require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Course = require('./models/course');

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
app.post('/course', async (req, res) => {
    const course = new Course({
        name: req.body.name,
        credits: req.body.credits
    })

    try {
        const courseCreated = await course.save();
        //add header location to the response
        res.header('Location', `/course?id=${courseCreated._id}`);
        res.status(201).json(courseCreated)
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
});

app.get('/course', async (req, res) => {
    try{
        //if id is passed as query param, return single course else return all courses
        if(!req.query.id){
            const data = await Course.find();
            return res.status(200).json(data)
        }
        const data = await Course.findById(req.query.id);
        res.status(200).json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

app.put('/course', async (req, res) => {
    try{
        const course = await Course.findByIdAndUpdate(
            req.query.id,
            {
                name: req.body.name,
                credits: req.body.credits
            },
            { new: true }
        );
        
        if(!course){
            return res.status(404).json({message: 'Curso no encontrado'})
        }
        
        res.status(200).json(course)
    }
    catch(error){
        res.status(400).json({message: error.message})
    }
})

app.delete('/course', async (req, res) => {
    try{
        const course = await Course.findByIdAndDelete(req.query.id);
        return res.status(204).json({message: 'Curso eliminado exitosamente'})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

app.listen(process.env.PORT, () => console.log(`Escuchando el puerto ${process.env.PORT}!`))