import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    // This stores the 128-float array from face-api.js
    faceDescriptor: {
        type: [Number],
        required: true
    }
}, { timestamps: true }); 

export default mongoose.model('Admin', AdminSchema); 
