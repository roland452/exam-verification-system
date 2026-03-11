import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Student from '../../model/students/student.js';
import Course from '../../model/admin/course.js';
import studentAuth from '../../controller/studentAuth.js';



const route = express.Router();
const RP_ID = 'localhost';
const ORIGIN = `http://localhost:5173`;



route.get('/api/student-auth', studentAuth, async(req, res, next) => {
    res.json({authenticated: true, profile: req.student})
    next() 
})

route.post('/api/student/logout',async (req, res) => {

    res.clearCookie('studentToken',{
        httpOnly: true,
        secure: true,
        sameSite:'none',
    })

    res.status(200).json({message:'student logout successful'})

})







// Helper: Calculate Euclidean distance for Face descriptors
const getFaceDistance = (desc1, desc2) => Math.sqrt(desc1.reduce((acc, val, i) => acc + Math.pow(val - desc2[i], 2), 0));

// --- STRATEGY 1: MATRIC & PASSWORD ---
route.post('/api/login/password', async (req, res) => {
    const { matric, password } = req.body;
    const student = await Student.findOne({ matric });
    
    if (!student || !(await bcrypt.compare(password, student.password))) {
        return res.status(401).json({ message: "Invalid matric or password" });
    }

    const token = jwt.sign({
        id: student._id,
        matric: student.matric,
        fullName: student.fullName,
        course: student.course,
        level: student.level,
        department: student.department,
        isProfileComplete: student.isProfileComplete
    }, process.env.STUDENT_JWT_SECRET, { expiresIn: '1d' });
    res.cookie('studentToken', token, { 
        httpOnly: true,
        secure: true,
        sameSite:'none',
     }).json({message: "Login successfully", success: true, isProfileComplete: student.isProfileComplete });
});






// --- STRATEGY 3: FACE ID ---
route.post('/api/login/face', async (req, res) => {

    const { matric, descriptor } = req.body; // Array of 128 numbers from frontend

    try {
        const student = await Student.findOne({ matric });

        // Compare stored descriptor with the new scan
        const distance = getFaceDistance(student.faceDescriptor, descriptor);

        
        if (distance < 0.6) { // Threshold: lower means more strict 
            const token = jwt.sign({ 
                id: student._id,
                matric: student.matric,
                fullName: student.fullName,
                course: student.course,
                level: student.level,
                department: student.department,
                isProfileComplete: student.isProfileComplete
            }, process.env.STUDENT_JWT_SECRET, { expiresIn: '1d' });
            return res.cookie('studentToken', token, { 
                httpOnly: true,
                secure: true,
                sameSite:'none',
             }).json({authenticated: true, message: "Login successful", success: true });
        }
        
        res.status(401).json({ message: "Face not recognized", success: false });
        
    } catch (error) {
        res.status(401).json({ message: "error occured check connection" });
    }
   
});




// ---  EXAM FACE VERIFICATION ---
route.post('/api/exam/face-verification', studentAuth, async (req, res) => {
    const { descriptor, examId } = req.body; 
    const matric = req.student.matric;

    try {
        const course = await Course.findById(examId);
        const student = await Student.findOne({ matric });

        if (!course) return res.status(404).json({ message: 'Course doesn\'t exist', success: false });

        // 1. Verify Face Identity
        const distance = getFaceDistance(student.faceDescriptor, descriptor);
        
        if (distance < 0.6) { 
            // 2. Check if student is already verified for this exam
            const isAlreadyVerified = course.verifiedStudents.includes(matric);

            if (!isAlreadyVerified) {
                // 3. Push matric to verifiedStudents array if not present
                course.verifiedStudents.push(matric);
                await course.save();
            }

            return res.json({ 
                authenticated: true, 
                message: isAlreadyVerified ? "Already Verified" : "Verification Successful", 
                success: true 
            });
        } else {
            return res.status(401).json({ message: "Face not recognized", success: false }); 
        }
        
    } catch (error) {
        console.error("Exam Verification Error:", error);
        res.status(500).json({ message: "An error occurred during verification" });
    }
});









// UPDATE PROFILE ROUTE
route.post('/api/update-profile', studentAuth, async (req, res) => {

    const { fullName, email, course, level } = req.body;
    
    try {
       

        // 1. Basic Validation
        if (!fullName || !email || !course || !level) {
            return res.status(400).json({ message: "Please fill all fields" });
        }

        // 2. Update the student using ID from studentAuth middleware
        const updatedStudent = await Student.findByIdAndUpdate(
            req.student.id, 
            { 
                fullName, 
                email, 
                course,
                level,
                isProfileComplete: true
            }, 
            { new: true, runValidators: true }
        ).select('-password -fingerDescriptor -faceDescriptor'); // Exclude sensitive data

        if (!updatedStudent) {
            return res.status(404).json({ message: "Student not found" });
        }

         const token = jwt.sign({ 
            id: updatedStudent._id,
            matric: updatedStudent.matric,
            fullName: updatedStudent.fullName,
            course: updatedStudent.course,
            level: updatedStudent.level,
            department: updatedStudent.department,
            isProfileComplete: updatedStudent.isProfileComplete
        }, process.env.STUDENT_JWT_SECRET, { expiresIn: '1d' });

        return res.cookie('studentToken', token, { 
            httpOnly: true,
            secure: true,
            sameSite:'none',
        }).json({ 
            success: true, 
            message: "Profile Updated Successfully!",
            student: updatedStudent 
        });


    } catch (error) {
        console.error("Update Profile Error:", error);
        res.status(500).json({ message: "Server error during profile update" });
    }
});






export default route;
