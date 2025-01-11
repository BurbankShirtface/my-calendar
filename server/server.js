app.use(
  cors({
    origin: ["http://localhost:5173", "https://your-frontend-url.onrender.com"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

app.get("/test", async (req, res) => {
  try {
    const Project = require("./models/Project");
    const projects = await Project.find();
    res.json({
      count: projects.length,
      projects: projects,
    });
  } catch (error) {
    res.json({ error: error.message });
  }
});
