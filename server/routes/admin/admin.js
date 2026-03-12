import express from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../../model/admin/admin.js';
import adminAuth from '../../controller/adminAuth.js';
const router = express.Router();

// Helper: Calculate Euclidean Distance between two 128-bit descriptors
const calculateDistance = (desc1, desc2) => {
    return Math.sqrt(
        desc1.reduce((sum, val, i) => sum + Math.pow(val - desc2[i], 2), 0)
    );
};




router.get('/api/admin-auth', adminAuth, async(req, res, next) => {
    res.json({authenticated: true, profile: req.admin})
    next() 
})






// @route   POST /api/admin/signup 
router.post('/api/admin/signup', async (req, res) => {
    try {
        const { username, descriptor } = req.body;
        
        // Check if admin already exists (since you only want one)
        const adminCount = await Admin.countDocuments();
        if (adminCount > 0) return res.status(400).json({ message: "Admin already registered" });

        const newAdmin = new Admin({
            username,
            faceDescriptor: descriptor
        });

        await newAdmin.save();
        res.status(201).json({ success: true, message: "Admin created" });
    } catch (error) {
        res.status(500).json({ message: "Signup failed" });
    }
});

// @route   POST /api/admin/login
router.post('/api/admin/login', async (req, res) => {
    try {
        const { descriptor } = req.body;
        const admin = await Admin.findOne(); // Fetch the only admin

        if (!admin) return res.status(404).json({ message: "No admin registered" });

        // CALCULATE DISTANCE (The Real Logic)
        // Standard threshold for face-api.js is 0.6. Lower is a closer match.
        const distance = calculateDistance(admin.faceDescriptor, descriptor);
        const threshold = 0.35; // Stricter threshold for Admin
        console.log(threshold,'threshhold')

        if (distance > threshold) {
            return res.status(401).json({ authenticated: false, message: "Face not recognized" });
        }

        // Generate Token
        const token = jwt.sign(
            { id: admin._id, username: admin.username },
            process.env.ADMIN_JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.cookie('adminToken', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 24 * 60 * 60 * 1000
        });

        res.json({ authenticated: true, message: "Login successful", distance }); 
    } catch (error) {
        res.status(500).json({ message: "Login error" });
        console.log(error);
    }
}); 




router.post('/api/admin/logout', async (req, res) => {

    res.clearCookie('adminToken',{
        httpOnly: true,
        secure: true,
        sameSite:'none',
    })

    res.status(200).json({message:'admin logout successful'})

})

export default router;
