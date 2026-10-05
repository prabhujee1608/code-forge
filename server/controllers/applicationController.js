import Application from '../models/Application.js';

// @desc    Get all user applications with filtering, search, sorting
// @route   GET /api/applications
export const getApplications = async (req, res) => {
  try {
    const { search, status, type, workMode, location, sortBy, sortOrder } = req.query;

    const query = { user: req.user._id };

    if (status) {
      query.status = status;
    }
    if (type) {
      query.type = type;
    }
    if (workMode) {
      query.workMode = workMode;
    }
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (search) {
      query.$or = [
        { company: { $regex: search, $options: 'i' } },
        { position: { $regex: search, $options: 'i' } },
        { requiredSkills: { $regex: search, $options: 'i' } },
      ];
    }

    let sort = { applicationDate: -1 };
    if (sortBy) {
      const order = sortOrder === 'asc' ? 1 : -1;
      sort = { [sortBy]: order };
    }

    const applications = await Application.find(query).sort(sort);
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single application by ID
// @route   GET /api/applications/:id
export const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new application
// @route   POST /api/applications
export const createApplication = async (req, res) => {
  try {
    const {
      company,
      position,
      type,
      location,
      workMode,
      jobUrl,
      applicationDate,
      deadline,
      status,
      salary,
      hrName,
      hrEmail,
      notes,
      requiredSkills,
      resumeVersion,
      interviewDate,
      followUpDate,
    } = req.body;

    if (!company || !position) {
      return res.status(400).json({ message: 'Company and position are required' });
    }

    const skillsArray = Array.isArray(requiredSkills)
      ? requiredSkills
      : requiredSkills
      ? requiredSkills.split(',').map(s => s.trim())
      : [];

    const application = await Application.create({
      user: req.user._id,
      company,
      position,
      type: type || 'Job',
      location: location || '',
      workMode: workMode || 'Remote',
      jobUrl: jobUrl || '',
      applicationDate: applicationDate || Date.now(),
      deadline: deadline || null,
      status: status || 'Applied',
      salary: salary || '',
      hrName: hrName || '',
      hrEmail: hrEmail || '',
      notes: notes || '',
      requiredSkills: skillsArray,
      resumeVersion: resumeVersion || 'General V1',
      interviewDate: interviewDate || null,
      followUpDate: followUpDate || null,
    });

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update application
// @route   PUT /api/applications/:id
export const updateApplication = async (req, res) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const fields = [
      'company',
      'position',
      'type',
      'location',
      'workMode',
      'jobUrl',
      'applicationDate',
      'deadline',
      'status',
      'salary',
      'hrName',
      'hrEmail',
      'notes',
      'resumeVersion',
      'interviewDate',
      'followUpDate',
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        application[field] = req.body[field];
      }
    });

    if (req.body.requiredSkills !== undefined) {
      application.requiredSkills = Array.isArray(req.body.requiredSkills)
        ? req.body.requiredSkills
        : req.body.requiredSkills.split(',').map(s => s.trim());
    }

    const updatedApplication = await application.save();
    res.json(updatedApplication);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete application
// @route   DELETE /api/applications/:id
export const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json({ message: 'Application removed successfully', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
