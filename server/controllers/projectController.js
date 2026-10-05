import Project from '../models/Project.js';

// @desc    Get all user projects
// @route   GET /api/projects
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new project
// @route   POST /api/projects
export const createProject = async (req, res) => {
  try {
    const { title, description, techStack, githubUrl, liveUrl, status, role, features } = req.body;
    
    if (!title) {
      return res.status(400).json({ message: 'Project title is required' });
    }

    const techArray = Array.isArray(techStack)
      ? techStack
      : typeof techStack === 'string'
      ? techStack.split(',').map((s) => s.trim())
      : [];

    const featureArray = Array.isArray(features)
      ? features
      : typeof features === 'string'
      ? features.split(',').map((f) => f.trim())
      : [];

    const readinessScore = Math.min(100, 60 + techArray.length * 8 + (githubUrl ? 10 : 0) + (liveUrl ? 10 : 0));

    const project = await Project.create({
      user: req.user._id,
      title,
      description: description || '',
      techStack: techArray,
      githubUrl: githubUrl || '',
      liveUrl: liveUrl || '',
      status: status || 'In Progress',
      role: role || 'Full Stack Developer',
      features: featureArray,
      readinessScore,
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
export const updateProject = async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, user: req.user._id });
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const { title, description, techStack, githubUrl, liveUrl, status, role, features } = req.body;

    if (title !== undefined) project.title = title;
    if (description !== undefined) project.description = description;
    if (githubUrl !== undefined) project.githubUrl = githubUrl;
    if (liveUrl !== undefined) project.liveUrl = liveUrl;
    if (status !== undefined) project.status = status;
    if (role !== undefined) project.role = role;

    if (techStack !== undefined) {
      project.techStack = Array.isArray(techStack) ? techStack : techStack.split(',').map((s) => s.trim());
    }
    if (features !== undefined) {
      project.features = Array.isArray(features) ? features : features.split(',').map((f) => f.trim());
    }

    project.readinessScore = Math.min(100, 60 + project.techStack.length * 8 + (project.githubUrl ? 10 : 0) + (project.liveUrl ? 10 : 0));

    const updated = await project.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
