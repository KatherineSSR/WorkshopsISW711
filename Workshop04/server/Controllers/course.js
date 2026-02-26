const express = require('express');
const Course = require('../models/course');

// POST - para crear curso
const coursePost = async (req, res) => {
    const course = new Course({
        name: req.body.name,
        code: req.body.code,
        description: req.body.description,
        teacherId: req.body.teacherId
    })

    try {
        const courseCreated = await course.save();
        res.header('Location', `/course?id=${courseCreated._id}`);
        res.status(201).json(courseCreated)
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
};

// GET - Obtener todos los cursos o uno por ID
const courseGet = async (req, res) => {
    try{
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
};

// PUT - Actualizar curso
const coursePut = async (req, res) => {
    try{
        const course = await Course.findByIdAndUpdate(
            req.query.id,
            {
                name: req.body.name,
                code: req.body.code,
                description: req.body.description,
                teacherId: req.body.teacherId
            },
            { new: true }
        );
        
        if(!course){
            return res.status(404).send()
        }
        
        res.status(200).json(course)
    }
    catch(error){
        res.status(400).json({message: error.message})
    }
};

// DELETE - Eliminar curso
const courseDelete = async (req, res) => {
    try{
        await Course.findByIdAndDelete(req.query.id);
        res.status(204).send()
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
};

module.exports = {
    coursePost,
    courseGet,
    coursePut,
    courseDelete
};
