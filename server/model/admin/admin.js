import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
    username: {
        type: String,
        default: 'admin'
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    faceDescriptor: {
        type: [Number],
        required: true,
        default: []
    }
}, { timestamps: true }); 

export default mongoose.model('Admin', AdminSchema); 
