import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    faceDescriptor: {
        type: [Number],
        required: true
    }
}, { timestamps: true }); 

export default mongoose.model('Admin', AdminSchema); 
