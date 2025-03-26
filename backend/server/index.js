// server/index.js
app.post("/api/logout", (req, res) => {
    // If using sessions, destroy the session
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).send("Could not log out");
      }
      res.send("Logged out successfully");
    });
  });