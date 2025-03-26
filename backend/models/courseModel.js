const db = require('../config/db');

const Course = {
  create: (courseData, callback) => {
    const { instructor_id, title, description, category, price, thumbnail } = courseData;
    const query = 'INSERT INTO courses (instructor_id, title, description, category, price, thumbnail) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [instructor_id, title, description, category, price, thumbnail], callback);
  },

  getByInstructor: (instructorId, callback) => {
    const query = 'SELECT * FROM courses WHERE instructor_id = ? ORDER BY created_at DESC';
    db.query(query, [instructorId], callback);
  },

  update: (courseId, courseData, callback) => {
    const { title, description, category, price, thumbnail, status } = courseData;
    const query = 'UPDATE courses SET title = ?, description = ?, category = ?, price = ?, thumbnail = ?, status = ? WHERE id = ?';
    db.query(query, [title, description, category, price, thumbnail, status, courseId], callback);
  },

  delete: (courseId, callback) => {
    const query = 'DELETE FROM courses WHERE id = ?';
    db.query(query, [courseId], callback);
  },

  addContent: (contentData, callback) => {
    const { course_id, title, content_type, content_url, content_text, sequence } = contentData;
    const query = 'INSERT INTO course_content (course_id, title, content_type, content_url, content_text, sequence) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [course_id, title, content_type, content_url, content_text, sequence], callback);
  },

  getContent: (courseId, callback) => {
    const query = 'SELECT * FROM course_content WHERE course_id = ? ORDER BY sequence';
    db.query(query, [courseId], callback);
  },

  updateContent: (contentId, contentData, callback) => {
    const { title, content_type, content_url, content_text, sequence } = contentData;
    const query = 'UPDATE course_content SET title = ?, content_type = ?, content_url = ?, content_text = ?, sequence = ? WHERE id = ?';
    db.query(query, [title, content_type, content_url, content_text, sequence, contentId], callback);
  },

  deleteContent: (contentId, callback) => {
    const query = 'DELETE FROM course_content WHERE id = ?';
    db.query(query, [contentId], callback);
  },

  addQuiz: (quizData, callback) => {
    const { content_id, question, options, correct_answer, points } = quizData;
    const query = 'INSERT INTO quizzes (content_id, question, options, correct_answer, points) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [content_id, question, JSON.stringify(options), correct_answer, points], callback);
  }
};