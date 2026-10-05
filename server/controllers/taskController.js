import StudyTask from '../models/StudyTask.js';

export const getTasks = async (req, res) => {
  try {
    const tasks = await StudyTask.find({ user: req.user._id }).sort({ dueDate: 1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createTask = async (req, res) => {
  try {
    const { title, category, dueDate } = req.body;
    if (!title) {
      return res.status(400).json({ message: 'Task title is required' });
    }

    const task = await StudyTask.create({
      user: req.user._id,
      title,
      category: category || 'Coding',
      dueDate: dueDate || Date.now(),
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const task = await StudyTask.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (req.body.completed !== undefined) task.completed = req.body.completed;
    if (req.body.title !== undefined) task.title = req.body.title;
    if (req.body.category !== undefined) task.category = req.body.category;
    if (req.body.dueDate !== undefined) task.dueDate = req.body.dueDate;

    const updated = await task.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await StudyTask.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task deleted', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
