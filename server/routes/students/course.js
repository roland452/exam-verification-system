import express from 'express'
const route = express.Router()
import Course from '../../model/admin/course.js'
import Notice from '../../model/admin/notice.js'
import studentAuth from '../../controller/studentAuth.js'


route.get('/api/student-courses', studentAuth, async(req, res) => {
  const student = req.student
  try {
    const courses = await Course.find({ level:student.level, department:student.course }).sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: "Server Error: Could not fetch courses" });
  }
});


route.get('/api/student-notices', async (req, res) => {
  try {
    // Mongoose automatically provides 'createdAt' because of { timestamps: true }
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.json(notices);
  } catch (err) {
    res.status(500).json({ message: "Server Error: Could not fetch notices" });
  }
});


route.patch('/api/verified-student', studentAuth, async(req, res) => {
    const { examId } = req.body;
    const matric = req.student.matric
    
    
    try {
        const course = await Course.findById(examId)
        
        if(!course) return res.status(401).json({message: 'course doesnt exist', success: false})


        const isVerified = course.verifiedStudents.includes(matric)

        const update = isVerified? { $pull: { verifiedStudents:matric } } : { $addToSet: { verifiedStudents: matric } }

        const updatedCourse = await Course.findByIdAndUpdate(examId, update, { new: true })

        return res.status(200).json({ message:'student verified', data:updatedCourse, success: false })
        
    } catch (error) {
        res.status(500).json({message:'failed'})
        console.log(error,'api student verification')
    }
})


export default route;