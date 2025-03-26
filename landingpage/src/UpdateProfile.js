import React, { useState } from "react";

const UpdateProfile = () => {
  const [name, setName] = useState("John Doe"); // Replace with dynamic data
  const [email, setEmail] = useState("johndoe@example.com"); // Replace with dynamic data

  const handleUpdate = () => {
    alert("Profile updated successfully!");
    // Add logic to update user data in backend
  };

  return (
    <div>
      <h2>Update Profile</h2>
      <label>
        Name:
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <br />
      <label>
        Email:
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <br />
      <button onClick={handleUpdate}>Save Changes</button>
    </div>
  );
};

export default UpdateProfile;
