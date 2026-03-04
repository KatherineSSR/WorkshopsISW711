const express = require('express');
const Teacher = require('../models/teacher');

// POST - Crear profesor
const teacherPost = async (req, res) => {
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
};

// GET - Obtener todos los profesores o uno por ID
const teacherGet = async (req, res) => {
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
};

// PUT - Actualizar profesor
const teacherPut = async (req, res) => {
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
            return res.status(404).send()
        }
        
        res.status(200).json(teacher)
    }
    catch(error){
        res.status(400).json({message: error.message})
    }
};

// DELETE - Eliminar profesor
const teacherDelete = async (req, res) => {
    try{
        await Teacher.findByIdAndDelete(req.query.id);
        res.status(204).send()
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
};

module.exports = {
    teacherPost,
    teacherGet,
    teacherPut,
    teacherDelete
};
