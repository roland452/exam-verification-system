import express from 'express'
const route = express.Router();
import Course from '../../model/admin/course.js'
import studentAuth from '../../controller/studentAuth.js';
import Student from '../../model/students/student.js';



// Helper: Calculate Euclidean distance for Face descriptors
const getFaceDistance = (desc1, desc2) => Math.sqrt(desc1.reduce((acc, val, i) => acc + Math.pow(val - desc2[i], 2), 0));


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






// ---  EXAM FACE VERIFICATION ---
route.post('/api/admin-exam/face-verification', async (req, res) => {
    const { descriptor, matric } = req.body; 

    try {
        const student = await Student.findOne({ matric });


        // 1. Verify Face Identity
        const distance = getFaceDistance(student.faceDescriptor, descriptor);
        
        if (distance < 0.45) { 
           
            
            return res.json({ 
                authenticated: true, 
                message: "Verification Successful", 
                success: true,
                profile:{
                  id: student._id,
                  matric: student.matric,
                  fullName: student.fullName,
                  course: student.course,
                  level: student.level,
                  department: student.department,
                  isProfileComplete: student.isProfileComplete
                }
            });
        } else {
            return res.status(401).json({ message: "Face not recognized", success: false }); 
        }
        
    } catch (error) {
        console.error("Exam Verification Error:", error);
        res.status(500).json({ message: "An error occurred during verification" });
    }
});








export default route;
