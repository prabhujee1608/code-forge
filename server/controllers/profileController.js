import User from '../models/User.js';

// @desc    Get user profile
// @route   GET /api/profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/profile
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const {
      name,
      phone,
      college,
      degree,
      branch,
      graduationYear,
      skills,
      githubUrl,
      linkedinUrl,
      portfolioUrl,
    } = req.body;

    user.name = name !== undefined ? name : user.name;
    user.phone = phone !== undefined ? phone : user.phone;
    user.college = college !== undefined ? college : user.college;
    user.degree = degree !== undefined ? degree : user.degree;
    user.branch = branch !== undefined ? branch : user.branch;
    user.graduationYear = graduationYear !== undefined ? graduationYear : user.graduationYear;
    user.skills = skills !== undefined ? (Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim())) : user.skills;
    user.githubUrl = githubUrl !== undefined ? githubUrl : user.githubUrl;
    user.linkedinUrl = linkedinUrl !== undefined ? linkedinUrl : user.linkedinUrl;
    user.portfolioUrl = portfolioUrl !== undefined ? portfolioUrl : user.portfolioUrl;

    const updatedUser = await user.save();
    const userObj = updatedUser.toObject();
    delete userObj.password;

    res.json(userObj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
