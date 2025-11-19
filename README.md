# Smart Resume Builder

An AI-powered resume builder application that helps users create professional, customized resumes with intelligent suggestions and multiple export options.

## Features

- 📋 **Multiple Resume Templates** - Choose from professionally designed templates
- 🤖 **AI-Powered Suggestions** - Get intelligent content recommendations for each section
- 👀 **Live Preview** - See your resume update in real-time
- 📄 **PDF Export** - Download your resume as a PDF
- 💾 **Cloud Storage** - Save and manage multiple resume versions
- ✨ **Smart Formatting** - Automatic formatting and optimization for ATS systems
- 📊 **Analytics** - Track resume views and downloads

## Project Structure

```
smart-resume-builder/
├── frontend/          # React TypeScript application
├── backend/           # Node.js Express API server
├── shared/            # Shared utilities and types
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 16+ and npm 8+
- MongoDB Atlas account (free tier available at https://www.mongodb.com/cloud/atlas)
  - Or local MongoDB for development

### Installation

1. Install all dependencies:
```bash
npm run install-all
```

2. Set up MongoDB Atlas:
   - Create a free MongoDB Atlas account (https://www.mongodb.com/cloud/atlas)
   - Create a cluster and database user
   - Get your connection string
   - See [MONGODB_ATLAS_SETUP.md](./MONGODB_ATLAS_SETUP.md) for detailed instructions

3. Configure environment variables:
   - Copy `.env.example` to `.env` in `/backend`:
   ```bash
   cp .env.example backend/.env
   ```
   - Update with your MongoDB Atlas connection string:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/resume-builder
   JWT_SECRET=your-secret-key
   OPENAI_API_KEY=your-openai-key
   ```

### Development

Start both frontend and backend development servers:
```bash
npm run dev
```

This will run:
- Frontend on `http://localhost:5173`
- Backend API on `http://localhost:3000`

### Building

Build both frontend and backend:
```bash
npm run build
```

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for fast development
- Tailwind CSS for styling
- React Router for navigation
- React Query for state management

### Backend
- Node.js with Express
- TypeScript
- MongoDB with Mongoose (MongoDB Atlas for cloud)
- JWT for authentication
- Multer for file uploads

### Database
- **MongoDB Atlas** - Recommended for production (Free tier available)
- **Local MongoDB** - Alternative for development
- See [MONGODB_ATLAS_SETUP.md](./MONGODB_ATLAS_SETUP.md) for setup guide

## API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/resumes` - Get user's resumes
- `POST /api/resumes` - Create new resume
- `GET /api/resumes/:id` - Get resume details
- `PUT /api/resumes/:id` - Update resume
- `DELETE /api/resumes/:id` - Delete resume
- `POST /api/resumes/:id/export` - Export as PDF
- `POST /api/suggestions` - Get AI suggestions

## Contributing

Contributions are welcome! Please follow the existing code style and submit pull requests.

## License

MIT License

## Support

For issues or questions, please open an issue on GitHub.
