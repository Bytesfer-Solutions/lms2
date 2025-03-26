import React, { useState } from "react"; 
import { FaBook, FaTasks, FaBell, FaSearch } from "react-icons/fa"; 
import "./StudentDashboard.css"; 

const StudentDashboard = () => { 
  const [selectedMenu, setSelectedMenu] = useState("Dashboard"); 
  const [searchTerm, setSearchTerm] = useState(""); 

  const courses = [ 
    { id: 1, name: "React Basics", progress: 70 }, 
    { id: 2, name: "Advanced JavaScript", progress: 45 }, 
    { id: 3, name: "Database Design", progress: 85 }, 
  ]; 

  const filteredCourses = courses.filter((course) => 
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) 
  ); 

  return ( 
    <div className="dashboard"> 
      {/* Sidebar */} 
      <div className="sidebar"> 
        <h2 className={selectedMenu === "Dashboard" ? "active" : ""} onClick={() => setSelectedMenu("Dashboard")}> 
          Dashboard 
        </h2> 
        <ul> 
          <li className={selectedMenu === "My Courses" ? "active" : ""} onClick={() => setSelectedMenu("My Courses")}> 
            <FaBook className="icon" /> My Courses 
          </li> 
          <li className={selectedMenu === "Pending Assignments" ? "active" : ""} onClick={() => setSelectedMenu("Pending Assignments")}> 
            <FaTasks className="icon" /> Pending Assignments 
          </li> 
          <li className={selectedMenu === "Notifications" ? "active" : ""} onClick={() => setSelectedMenu("Notifications")}> 
            <FaBell className="icon" /> Notifications 
          </li> 
        </ul> 
      </div> 

      {/* Main Content */} 
      <div className="content"> 
        <h1>{selectedMenu}</h1> 

        {selectedMenu === "Dashboard" && ( 
          <div className="dashboard-section"> 
            {/* Search Bar */} 
            <div className="search-bar"> 
              <FaSearch className="search-icon" /> 
              <input 
                type="text" 
                placeholder="Search courses..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
              /> 
            </div> 

            <h2>Welcome to your Student Dashboard!</h2> 
            <p>Navigate using the menu to explore courses, assignments, and more.</p> 
          </div> 
        )} 

        {/* Display Content Based on Selected Menu */} 
        {selectedMenu === "My Courses" && 
          filteredCourses.map((course) => ( 
            <div key={course.id} className="course-item"> 
              <span>{course.name}</span> 
              <div className="progress-bar"> 
                <div className="progress" style={{ width: `${course.progress}%` }}></div> 
              </div> 
            </div> 
          ))} 

        {selectedMenu === "Pending Assignments" && <p>List of pending assignments...</p>} 
        {selectedMenu === "Notifications" && <p>You have 3 new notifications.</p>} 
      </div> 
    </div> 
  ); 
}; 

export default StudentDashboard;
