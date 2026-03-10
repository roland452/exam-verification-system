import mongoose from 'mongoose'

const noticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  action: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['info', 'urgent', 'update'],
    default: 'info'
  }
}, { 
  // This replaces the manual createdAt field with automatic Mongoose timestamps
  timestamps: true 
});

export default mongoose.model('Notice', noticeSchema);
