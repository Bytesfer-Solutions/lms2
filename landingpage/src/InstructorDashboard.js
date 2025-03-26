import React, { useState, useEffect } from "react";
import { FaBook, FaUsers, FaTasks, FaBell, FaPlus, FaEdit, FaTrash, FaUpload } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./InstructorDashboard.css";

const InstructorDashboard = () => {
  const [selectedMenu, setSelectedMenu] = useState("My Courses");
  const [courses, setCourses] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showContentModal, setShowContentModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseContent, setCourseContent] = useState([]);
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    thumbnail: null
  });
  const [newContent, setNewContent] = useState({
    title: "",
    content_type: "video",
    content_text: "",
    sequence: 1,
    file: null
  });
  const [quizData, setQuizData] = useState({
    question: "",
    options: ["", "", "", ""],
    correct_answer: "",
    points: 1
  });

  const navigate = useNavigate();
  const instructorId = localStorage.getItem("userId");

  useEffect(() => {
    if (selectedMenu === "My Courses") {
      fetchCourses();
    }
    if (selectedCourse && selectedMenu === "Course Content") {
      fetchCourseContent();
    }
  }, [selectedMenu, selectedCourse]);

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/instructors/${instructorId}/courses`);
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const fetchCourseContent = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/courses/${selectedCourse}/content`);
      setCourseContent(response.data);
    } catch (error) {
      console.error("Error fetching course content:", error);
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("instructor_id", instructorId);
    formData.append("title", newCourse.title);
    formData.append("description", newCourse.description);
    formData.append("category", newCourse.category);
    formData.append("price", newCourse.price);
    if (newCourse.thumbnail) {
      formData.append("thumbnail", newCourse.thumbnail);
    }

    try {
      await axios.post("http://localhost:5000/api/courses", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      setShowCreateModal(false);
      setNewCourse({
        title: "",
        description: "",
        category: "",
        price: "",
        thumbnail: null
      });
      fetchCourses();
    } catch (error) {
      console.error("Error creating course:", error);
    }
  };

  const handleAddContent = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("course_id", selectedCourse);
    formData.append("title", newContent.title);
    formData.append("content_type", newContent.content_type);
    formData.append("content_text", newContent.content_text);
    formData.append("sequence", newContent.sequence);
    if (newContent.file) {
      formData.append("file", newContent.file);
    }
    if (newContent.content_type === "quiz") {
      formData.append("quiz", JSON.stringify(quizData));
    }

    try {
      await axios.post(`http://localhost:5000/api/courses/${selectedCourse}/content`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      setShowContentModal(false);
      setNewContent({
        title: "",
        content_type: "video",
        content_text: "",
        sequence: 1,
        file: null
      });
      fetchCourseContent();
    } catch (error) {
      console.error("Error adding content:", error);
    }
  };

  const handlePublishCourse = async (courseId) => {
    try {
      await axios.put(`http://localhost:5000/api/courses/${courseId}`, {
        status: "published"
      });
      fetchCourses();
    } catch (error) {
      console.error("Error publishing course:", error);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      await axios.delete(`http://localhost:5000/api/courses/${courseId}`);
      fetchCourses();
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  return (
    <div className="dashboard">
      <div className="sidebar">
        <h2 className="dashboard-title">Instructor Dashboard</h2>
        <ul>
          <li className={selectedMenu === "My Courses" ? "active" : ""} onClick={() => setSelectedMenu("My Courses")}>
            <FaBook className="icon" /> My Courses
          </li>
          {selectedCourse && (
            <li className={selectedMenu === "Course Content" ? "active" : ""} onClick={() => setSelectedMenu("Course Content")}>
              <FaBook className="icon" /> Course Content
            </li>
          )}
          <li className={selectedMenu === "Students" ? "active" : ""} onClick={() => setSelectedMenu("Students")}>
            <FaUsers className="icon" /> Students
          </li>
        </ul>
      </div>

      <div className="content">
        <h1>{selectedMenu}</h1>
        
        {selectedMenu === "My Courses" && (
          <div className="courses-section">
            <button className="create-course-btn" onClick={() => setShowCreateModal(true)}>
              <FaPlus /> Create New Course
            </button>
            
            <div className="courses-list">
              {courses.map(course => (
                <div key={course.id} className="course-card">
                  {course.thumbnail && (
                    <img src={`http://localhost:5000${course.thumbnail}`} alt={course.title} className="course-thumbnail" />
                  )}
                  <div className="course-details">
                    <h3>{course.title}</h3>
                    <p>{course.description}</p>
                    <div className="course-meta">
                      <span className="course-category">{course.category}</span>
                      <span className="course-price">${course.price}</span>
                      <span className={`course-status ${course.status}`}>{course.status}</span>
                    </div>
                  </div>
                  <div className="course-actions">
                    <button onClick={() => {
                      setSelectedCourse(course.id);
                      setSelectedMenu("Course Content");
                    }}>
                      <FaEdit /> Manage Content
                    </button>
                    <button onClick={() => handlePublishCourse(course.id)} disabled={course.status === 'published'}>
                      Publish
                    </button>
                    <button onClick={() => handleDeleteCourse(course.id)} className="delete-btn">
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedMenu === "Course Content" && selectedCourse && (
          <div className="content-section">
            <button className="add-content-btn" onClick={() => setShowContentModal(true)}>
              <FaPlus /> Add Content
            </button>
            
            <div className="content-list">
              {courseContent.map(content => (
                <div key={content.id} className="content-item">
                  <h3>{content.title} <span className="content-type">{content.content_type}</span></h3>
                  {content.content_type === 'video' && content.content_url && (
                    <video controls className="content-preview">
                      <source src={`http://localhost:5000${content.content_url}`} type="video/mp4" />
                    </video>
                  )}
                  {content.content_type === 'pdf' && content.content_url && (
                    <iframe 
                      src={`http://localhost:5000${content.content_url}`} 
                      className="content-preview"
                      title={content.title}
                    />
                  )}
                  {content.content_text && <p>{content.content_text}</p>}
                  <div className="content-actions">
                    <button><FaEdit /> Edit</button>
                    <button className="delete-btn"><FaTrash /> Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Create Course Modal */}
        {showCreateModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Create New Course</h2>
              <form onSubmit={handleCreateCourse}>
                <div className="form-group">
                  <label>Title</label>
                  <input 
                    type="text" 
                    value={newCourse.title}
                    onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea 
                    value={newCourse.description}
                    onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <input 
                    type="text" 
                    value={newCourse.category}
                    onChange={(e) => setNewCourse({...newCourse, category: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Price ($)</label>
                  <input 
                    type="number" 
                    value={newCourse.price}
                    onChange={(e) => setNewCourse({...newCourse, price: e.target.value})}
                    step="0.01"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Thumbnail</label>
                  <input 
                    type="file" 
                    onChange={(e) => setNewCourse({...newCourse, thumbnail: e.target.files[0]})}
                    accept="image/*"
                  />
                </div>
                <div className="modal-actions">
                  <button type="button" onClick={() => setShowCreateModal(false)}>Cancel</button>
                  <button type="submit">Create Course</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Content Modal */}
        {showContentModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Add Course Content</h2>
              <form onSubmit={handleAddContent}>
                <div className="form-group">
                  <label>Title</label>
                  <input 
                    type="text" 
                    value={newContent.title}
                    onChange={(e) => setNewContent({...newContent, title: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Content Type</label>
                  <select
                    value={newContent.content_type}
                    onChange={(e) => setNewContent({...newContent, content_type: e.target.value})}
                  >
                    <option value="video">Video</option>
                    <option value="pdf">PDF</option>
                    <option value="quiz">Quiz</option>
                    <option value="text">Text</option>
                  </select>
                </div>
                {newContent.content_type === 'text' && (
                  <div className="form-group">
                    <label>Content Text</label>
                    <textarea 
                      value={newContent.content_text}
                      onChange={(e) => setNewContent({...newContent, content_text: e.target.value})}
                      required
                    />
                  </div>
                )}
                {(newContent.content_type === 'video' || newContent.content_type === 'pdf') && (
                  <div className="form-group">
                    <label>Upload File</label>
                    <input 
                      type="file" 
                      onChange={(e) => setNewContent({...newContent, file: e.target.files[0]})}
                      accept={newContent.content_type === 'video' ? 'video/*' : 'application/pdf'}
                      required
                    />
                  </div>
                )}
                {newContent.content_type === 'quiz' && (
                  <div className="quiz-form">
                    <div className="form-group">
                      <label>Question</label>
                      <input 
                        type="text" 
                        value={quizData.question}
                        onChange={(e) => setQuizData({...quizData, question: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Options</label>
                      {quizData.options.map((option, index) => (
                        <input
                          key={index}
                          type="text"
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...quizData.options];
                            newOptions[index] = e.target.value;
                            setQuizData({...quizData, options: newOptions});
                          }}
                          required
                        />
                      ))}
                    </div>
                    <div className="form-group">
                      <label>Correct Answer</label>
                      <select
                        value={quizData.correct_answer}
                        onChange={(e) => setQuizData({...quizData, correct_answer: e.target.value})}
                        required
                      >
                        <option value="">Select correct option</option>
                        {quizData.options.map((option, index) => (
                          <option key={index} value={option}>{option || `Option ${index + 1}`}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Points</label>
                      <input 
                        type="number" 
                        value={quizData.points}
                        onChange={(e) => setQuizData({...quizData, points: parseInt(e.target.value) || 1})}
                        min="1"
                      />
                    </div>
                  </div>
                )}
                <div className="form-group">
                  <label>Sequence</label>
                  <input 
                    type="number" 
                    value={newContent.sequence}
                    onChange={(e) => setNewContent({...newContent, sequence: parseInt(e.target.value) || 1})}
                    min="1"
                  />
                </div>
                <div className="modal-actions">
                  <button type="button" onClick={() => setShowContentModal(false)}>Cancel</button>
                  <button type="submit">Add Content</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorDashboard;