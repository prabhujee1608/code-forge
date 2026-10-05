import SavedJob from '../models/SavedJob.js';
import Application from '../models/Application.js';

// @desc    Get all saved jobs for current user
// @route   GET /api/saved
export const getSavedJobs = async (req, res) => {
  try {
    const savedJobs = await SavedJob.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(savedJobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Save new job opportunity
// @route   POST /api/saved
export const createSavedJob = async (req, res) => {
  try {
    const { company, position, url, location, workMode, type, salary, deadline, skills, notes } = req.body;

    if (!company || !position) {
      return res.status(400).json({ message: 'Company and position are required' });
    }

    const skillsArray = Array.isArray(skills)
      ? skills
      : skills
      ? skills.split(',').map(s => s.trim())
      : [];

    const savedJob = await SavedJob.create({
      user: req.user._id,
      company,
      position,
      url: url || '',
      location: location || '',
      workMode: workMode || 'Remote',
      type: type || 'Job',
      salary: salary || '',
      deadline: deadline || null,
      skills: skillsArray,
      notes: notes || '',
    });

    res.status(201).json(savedJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update saved job
// @route   PUT /api/saved/:id
export const updateSavedJob = async (req, res) => {
  try {
    const savedJob = await SavedJob.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!savedJob) {
      return res.status(404).json({ message: 'Saved job not found' });
    }

    const fields = ['company', 'position', 'url', 'location', 'workMode', 'type', 'salary', 'deadline', 'notes'];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        savedJob[field] = req.body[field];
      }
    });

    if (req.body.skills !== undefined) {
      savedJob.skills = Array.isArray(req.body.skills)
        ? req.body.skills
        : req.body.skills.split(',').map(s => s.trim());
    }

    const updatedJob = await savedJob.save();
    res.json(updatedJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete saved job
// @route   DELETE /api/saved/:id
export const deleteSavedJob = async (req, res) => {
  try {
    const savedJob = await SavedJob.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!savedJob) {
      return res.status(404).json({ message: 'Saved job not found' });
    }

    res.json({ message: 'Saved job removed', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Convert saved job to active application
// @route   POST /api/saved/:id/apply
export const convertToApplication = async (req, res) => {
  try {
    const savedJob = await SavedJob.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!savedJob) {
      return res.status(404).json({ message: 'Saved job not found' });
    }

    // Create Application
    const application = await Application.create({
      user: req.user._id,
      company: savedJob.company,
      position: savedJob.position,
      type: savedJob.type,
      location: savedJob.location,
      workMode: savedJob.workMode,
      jobUrl: savedJob.url,
      applicationDate: Date.now(),
      deadline: savedJob.deadline,
      status: 'Applied',
      salary: savedJob.salary,
      notes: savedJob.notes,
      requiredSkills: savedJob.skills,
    });

    // Optionally delete from saved jobs
    await SavedJob.findByIdAndDelete(savedJob._id);

    res.status(201).json({
      message: 'Successfully converted to application!',
      application,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
