const express = require('express');
const router = express.Router();
const { teacherPost, teacherPut, teacherGet, teacherDelete } = require("../Controllers/teacher");


//Post Method
router.post('/teacher', teacherPost)
router.put('/teacher', teacherPut)
router.delete('/teacher', teacherDelete)
router.get('/teachers', teacherGet)

module.exports = router;