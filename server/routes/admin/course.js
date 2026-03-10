import express from 'express'
const route = express.Router();
import Course from '../../model/admin/course.js'



// @route   GET /api/courses
// @desc    Fetch all courses (to populate the grid)
route.get('/api/courses', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: "Server Error: Could not fetch courses" });
  }
});



// @route   POST /api/courses
// @desc    Create a new course (Establish Course)
route.post('/api/courses', async (req, res) => {
  try {
    const { code, title, level, status, venue, lat, lng, examDate, examTime, department } = req.body;
    
    const newCourse = new Course({
      code,
      title,
      level,
      status,
      venue,
      lat,
      lng,
      examDate,
      examTime,
      department,
      verifiedStudents: [] // Initialized as empty array as requested 
    });

    const savedCourse = await newCourse.save();
    res.status(201).json(savedCourse);
  } catch (err) {
    res.status(400).json({ message: "Error: Course code might already exist" });
    console.log(err)
  }
});




// @route   PUT /api/courses/:id
// @desc    Update existing course (Save Configuration)
route.put('/api/courses/:id', async (req, res) => {
  try {
    const { code, title, level, status, venue, lat, lng, examDate, examTime, department  } = req.body;
    
    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      { code, title, level, status, venue, lat, lng, examDate, examTime, department },
      { new: true } // Returns the updated document
    );

    if (!updatedCourse) return res.status(404).json({ message: "Course not found" });
    res.json(updatedCourse);
  } catch (err) {
    res.status(400).json({ message: "Error updating course" });
  }
});




// @route   DELETE /api/courses/:id
// @desc    Delete a course
route.delete('/api/courses/:id', async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json({ message: "Course deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting course" });
  }
});

export default route;
