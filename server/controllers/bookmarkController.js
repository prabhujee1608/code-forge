import Bookmark from '../models/Bookmark.js';

// @desc    Get user bookmarks
// @route   GET /api/bookmarks
export const getBookmarks = async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(bookmarks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle bookmark item
// @route   POST /api/bookmarks
export const toggleBookmark = async (req, res) => {
  try {
    const { itemType, itemId, title, category } = req.body;

    const existing = await Bookmark.findOne({
      user: req.user._id,
      itemType,
      itemId,
    });

    if (existing) {
      await Bookmark.findByIdAndDelete(existing._id);
      return res.json({ isBookmarked: false, message: 'Bookmark removed' });
    }

    const newBookmark = await Bookmark.create({
      user: req.user._id,
      itemType: itemType || 'lesson',
      itemId,
      title: title || 'Bookmarked Content',
      category: category || 'General',
    });

    res.status(201).json({ isBookmarked: true, bookmark: newBookmark });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
