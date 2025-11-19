import mongoose from 'mongoose'

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    location: String,
    summary: String,
    experience: [
      {
        id: String,
        company: String,
        position: String,
        startDate: String,
        endDate: String,
        current: Boolean,
        description: String,
      },
    ],
    education: [
      {
        id: String,
        school: String,
        degree: String,
        field: String,
        startDate: String,
        endDate: String,
        description: String,
      },
    ],
    skills: [
      {
        id: String,
        name: String,
        level: {
          type: String,
          enum: ['beginner', 'intermediate', 'advanced', 'expert'],
        },
      },
    ],
    template: {
      type: String,
      enum: ['modern', 'classic', 'minimal'],
      default: 'modern',
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('Resume', resumeSchema)
