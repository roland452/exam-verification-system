import express from 'express'
const route = express.Router();
import Notice from '../../model/admin/notice.js'


// @route   GET /api/notices
// @desc    Fetch all notices sorted by most recent
route.get('/api/notices', async (req, res) => {
  try {
    // Mongoose automatically provides 'createdAt' because of { timestamps: true }
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.json(notices);
  } catch (err) {
    res.status(500).json({ message: "Server Error: Could not fetch notices" });
  }
});

// @route   POST /api/notices
// @desc    Create a new notice (Post to Students)
route.post('/api/notices', async (req, res) => {
  try {
    const { title, action, type } = req.body;
    
    const newNotice = new Notice({
      title,
      action,
      type
    });

    const savedNotice = await newNotice.save();
    res.status(201).json(savedNotice);
  } catch (err) {
    res.status(400).json({ message: "Error: Could not create notice" });
  }
});

// @route   PUT /api/notices/:id
// @desc    Update a notice (Update Broadcast)
route.put('/api/notices/:id', async (req, res) => {
  try {
    const { title, action, type } = req.body;
    
    // { new: true } returns the updated document instead of the old one
    const updatedNotice = await Notice.findByIdAndUpdate(
      req.params.id,
      { title, action, type },
      { new: true }
    );

    if (!updatedNotice) return res.status(404).json({ message: "Notice not found" });
    res.json(updatedNotice);
  } catch (err) {
    res.status(400).json({ message: "Error updating notice" });
  }
});

// @route   DELETE /api/notices/:id
// @desc    Delete a notice
route.delete('/api/notices/:id', async (req, res) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);
    if (!notice) return res.status(404).json({ message: "Notice not found" });
    res.json({ message: "Notice deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting notice" });
  }
});

export default route;
