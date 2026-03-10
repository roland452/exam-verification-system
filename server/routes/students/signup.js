import express from 'express';
import Student from '../../model/students/student.js';
import bcrypt from 'bcryptjs';

const route = express.Router();





// STEP 2: Verify and Save 
route.post('/api/signup', async (req, res) => {
    try {
        const { matric, password, faceDescriptor } = req.body;

        const isRegistered = await Student.findOne({matric})
        if(isRegistered) return res.status(201).json({ success: false, message: "Student Already registered!" });

        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Save the student with the newly generated credential details 
        await Student.create({
            matric,
            password: hashedPassword,
            faceDescriptor,
            isProfileComplete: false
        });

        res.status(201).json({ success: true, message: "Student registered!" });

    } catch (error) {
        console.error("Signup Error:", error.message);
        res.status(400).json({ message: "Registration Failed: " + error.message });
    }
});



export default route;

