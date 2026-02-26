const express = require('express');
const router = express.Router();
const { coursePost, courseGet, courseDelete, coursePut } = require("../Controllers/course");

router.post('/course', coursePost)
router.get('/courses', courseGet)
router.put('/course', coursePut)
router.delete('/course', courseDelete)

module.exports = router;