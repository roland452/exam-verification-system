import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema({
    matric: { 
        type: String, 
        required: true, 
        unique: true,
        uppercase: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    faceDescriptor: { 
        type: [Number], 
        required: true 
    },
    // Fields to be set up after signing up
    fullName: { type: String, default: "" },
    email: { type: String, default: "" },
    level: { type: String, default: "" },
    department: { type: String, enum: ['computer science', 'mathematics', 'micro biology', 'statistic']}, 
    course: { type: String, default: "" },
    isProfileComplete: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Student', StudentSchema);
