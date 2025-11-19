# Smart Resume Builder - Development Guide

## Quick Start

### 1. Install Dependencies
```bash
npm run install-all
```

### 2. Environment Setup
Copy `.env.example` to `.env` in both `frontend` and `backend` directories:
```bash
cp .env.example .env
```

### 3. Start Development Servers
```bash
npm run dev
```

This will start:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

## Project Structure

```
smart-resume-builder/
├── frontend/                 # React TypeScript Vite app
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── context/         # React context (state management)
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   └── package.json
│
├── backend/                  # Express TypeScript API
│   ├── src/
│   │   ├── models/          # MongoDB models (TODO)
│   │   ├── routes/          # API routes (TODO)
│   │   ├── middleware/      # Custom middleware (TODO)
│   │   ├── controllers/     # Route handlers (TODO)
│   │   └── index.ts         # Main server file
│   └── package.json
│
├── shared/                   # Shared utilities and types
│   └── types.ts             # TypeScript interfaces
│
└── README.md
```

## Development Workflow

### Frontend Development
The frontend uses:
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS
- **React Router** - Client-side routing
- **Zustand** - State management (can be configured)
- **Axios** - HTTP client

Key files to edit:
- `frontend/src/pages/` - Page components
- `frontend/src/components/` - Reusable components
- `frontend/src/services/` - API integration

### Backend Development
The backend provides REST API endpoints for:
- User authentication
- Resume CRUD operations
- PDF export
- AI suggestions

Key files to implement:
- `backend/src/models/` - Database schemas
- `backend/src/routes/` - Route definitions
- `backend/src/controllers/` - Business logic

## Key Features to Implement

### Phase 1 - Core
- [ ] User authentication (Register/Login)
- [ ] Create, read, update, delete resumes
- [ ] Save resume drafts
- [ ] Choose and apply templates

### Phase 2 - Enhancement
- [ ] PDF export functionality
- [ ] Real-time preview
- [ ] Multiple resume templates (modern, classic, minimal)
- [ ] Cloud storage with MongoDB

### Phase 3 - AI Integration
- [ ] OpenAI API integration for content suggestions
- [ ] Grammar and spelling improvements
- [ ] Job-specific optimization

### Phase 4 - Advanced
- [ ] ATS score calculation
- [ ] Resume analytics
- [ ] Cover letter generation
- [ ] Social media integration

## API Endpoints Reference

### Authentication
- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - User login, returns JWT

### Resumes
- `GET /api/resumes` - Get all user resumes
- `POST /api/resumes` - Create new resume
- `GET /api/resumes/:id` - Get resume by ID
- `PUT /api/resumes/:id` - Update resume
- `DELETE /api/resumes/:id` - Delete resume
- `GET /api/resumes/:id/export` - Export resume as PDF

### Suggestions
- `POST /api/suggestions` - Get AI suggestions for content

## Database Schema (MongoDB)

### User Collection
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  name: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Resume Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  title: String,
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  location: String,
  summary: String,
  experience: Array,
  education: Array,
  skills: Array,
  template: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Troubleshooting

### Dependencies not installed
```bash
cd frontend && npm install
cd ../backend && npm install
```

### API not responding
- Check if backend is running on port 3000
- Check browser console for CORS errors
- Verify `.env` file configuration

### Build errors
```bash
npm run type-check  # Check TypeScript errors
```

## Building for Production

```bash
npm run build
```

This creates optimized builds in:
- `frontend/dist/` - Static files for deployment
- `backend/dist/` - Compiled JavaScript

## Deployment

### Frontend
The built files in `frontend/dist/` can be deployed to:
- Vercel, Netlify, GitHub Pages, S3, etc.

### Backend
Deploy to:
- Heroku, Railway, DigitalOcean, AWS, etc.

## Contributing

1. Create a feature branch
2. Make your changes
3. Test locally
4. Submit a pull request

## Support

For questions or issues, please check:
- Frontend errors in browser DevTools
- Backend errors in terminal output
- `.env` configuration

Happy coding! 🚀
