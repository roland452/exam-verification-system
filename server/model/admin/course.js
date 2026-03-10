// course.js
import mongoose from 'mongoose'

const courseSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  // New Field: Dropdown selection on frontend
  department: {
    type: String,
    required: true,
    trim: true
  },
  level: {
    type: String,
    required: true,
    enum: ['100', '200', '300', '400']
  },
  // New Field: Stored as string from the date input
  examDate: {
    type: String, 
    required: true
  },
  // New Field: Stored as string from the time input
  examTime: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'ongoing', 'completed'],
    default: 'pending'
  },
  venue: {
    type: String,
    required: true
  },
  lat: {
    type: Number,
    required: true
  },
  lng: {
    type: Number,
    required: true
  },
  // Array storing student matric numbers
  verifiedStudents: {
    type: [String], 
    default: []
  }
});

export default mongoose.model('Course', courseSchema);
