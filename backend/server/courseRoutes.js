const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const multer = require('multer');
const path = require('path');
const authMiddleware = require('../middleware/authMiddleware');

// Configure storage for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Instructor routes
router.post('/courses', authMiddleware, upload.single('thumbnail'), courseController.createCourse);
router.get('/instructors/:instructorId/courses', authMiddleware, courseController.getInstructorCourses);
router.put('/courses/:courseId', authMiddleware, upload.single('thumbnail'), courseController.updateCourse);
router.delete('/courses/:courseId', authMiddleware, courseController.deleteCourse);

// Course content routes
router.post('/courses/:courseId/content', authMiddleware, upload.single('file'), courseController.uploadContent);
router.get('/courses/:courseId/content', authMiddleware, courseController.getCourseContent);

module.exports = router;