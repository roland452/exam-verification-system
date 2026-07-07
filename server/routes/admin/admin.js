import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'
import Admin from '../../model/admin/admin.js';
import adminAuth from '../../controller/adminAuth.js';
const router = express.Router();

// Helper: Calculate Euclidean Distance between two 128-bit descriptors
const calculateDistance = (desc1, desc2) => {
    return Math.sqrt(
        desc1.reduce((sum, val, i) => sum + Math.pow(val - desc2[i], 2), 0)
    );
};

// Shared helper: issue the adminToken cookie the same way for both auth methods
const issueAdminToken = (res, admin) => {
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
};

router.get('/api/admin-auth', adminAuth, async (req, res, next) => {
    res.json({ authenticated: true, profile: req.admin })
    next()
})


// @route   POST /api/admin/signup  (face)
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

// @route   POST /api/admin/login  (face)
router.post('/api/admin/login', async (req, res) => {
    try {
        const { descriptor } = req.body;
        const admin = await Admin.findOne(); // Fetch the only admin

        if (!admin) return res.status(404).json({ message: "No admin registered" });
        if (!admin.faceDescriptor || admin.faceDescriptor.length === 0) {
            return res.status(400).json({ message: "This admin account has no face enrolled. Use email login instead." });
        }

        // CALCULATE DISTANCE (The Real Logic)
        const distance = calculateDistance(admin.faceDescriptor, descriptor);
        const threshold = 0.45; // Stricter threshold for Admin

        if (distance > threshold) {
            return res.status(401).json({ authenticated: false, message: "Face not recognized" });
        }

        issueAdminToken(res, admin);

        res.json({ authenticated: true, message: "Login successful", distance });
    } catch (error) {
        res.status(500).json({ message: "Login error" });
        console.log(error);
    }
});


// @route   POST /api/admin/signup-email
// Creates the one-and-only admin using email + password instead of a face scan.
router.post('/api/admin/signup-email', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = new Admin({
            username: username || "admin",
            email,
            password: hashedPassword,
        });

        await newAdmin.save();
        res.status(201).json({ success: true, message: "Admin created" });
    } catch (error) {
        console.log(error);
        // Handles a unique-index violation if `email` is set to unique in the schema
        if (error.code === 11000) {
            return res.status(400).json({ message: "That email is already in use" });
        }
        res.status(500).json({ message: "Signup failed" });

    }
});


// @route   POST /api/admin/login-email
router.post('/api/admin/login-email', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const admin = await Admin.findOne({ email });
        
        if (!admin || !admin.password) {
            return res.status(401).json({ authenticated: false, message: `${admin, 'Invalid email or password'}` });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ authenticated: false, message: `${admin, 'Invalid email or password'}` });
        }

        issueAdminToken(res, admin);

        res.json({ authenticated: true, message: "Login successful" });
    } catch (error) {
        res.status(500).json({ message: "Login error" });
        console.log(error);
    }
});



router.post('/api/admin/logout', async (req, res) => {

    res.clearCookie('adminToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
    })

    res.status(200).json({ message: 'admin logout successful' })

})

export default router;
