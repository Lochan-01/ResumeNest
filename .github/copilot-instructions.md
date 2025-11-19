# Smart Resume Builder - Copilot Instructions

## Project Overview
A full-stack AI-powered smart resume builder with:
- React TypeScript frontend for resume creation and editing
- Express.js backend API for data persistence
- MongoDB integration for cloud storage
- AI content suggestions using OpenAI
- PDF export functionality
- Multiple professional templates

## Project Structure
- `frontend/` - React + Vite + Tailwind CSS + TypeScript
- `backend/` - Express.js + MongoDB + TypeScript
- `shared/` - Common types and utilities

## Development Stack

### Frontend
- React 18, TypeScript, Vite
- Tailwind CSS for styling
- React Router for navigation
- Axios for API calls
- HTML2PDF/jsPDF for export

### Backend
- Express.js with TypeScript
- MongoDB with Mongoose (to be configured)
- JWT authentication
- CORS middleware
- Multer for file uploads

## Getting Started

### Installation
```bash
npm run install-all
```

### Development Mode
```bash
npm run dev
```
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

### Building
```bash
npm run build
```

## Key Implementation Areas

### Completed
✅ Project scaffolding and folder structure
✅ TypeScript configuration for both frontend and backend
✅ React component structure and routing
✅ API service layer with Axios
✅ Context API for state management
✅ Tailwind CSS styling setup
✅ Express server with base routes
✅ Environment configuration

### To Implement
- MongoDB models for User and Resume
- Authentication endpoints (register, login, JWT)
- Resume CRUD endpoints
- PDF generation and export
- OpenAI integration for suggestions
- Input validation and error handling
- Unit and integration tests

## Important Notes

1. **Dependencies**: Must run `npm run install-all` before development
2. **Environment**: Create `.env` files based on `.env.example`
3. **Database**: Configure MongoDB connection in backend `.env`
4. **API Keys**: Add OpenAI API key for suggestion features
5. **Ports**: Frontend (5173), Backend (3000) must be available

## File Organization Guidelines

- React components in `frontend/src/components/` and `frontend/src/pages/`
- API logic in `frontend/src/services/`
- Backend routes in `backend/src/routes/`
- Business logic in `backend/src/controllers/`
- Database models in `backend/src/models/`

## Common Commands

```bash
# Install all dependencies
npm run install-all

# Development with hot reload
npm run dev

# Run only frontend
npm run dev:frontend

# Run only backend
npm run dev:backend

# Build for production
npm run build

# Type checking
npm run type-check
```

## References
- See DEVELOPMENT.md for detailed feature planning
- See README.md for project overview
- See shared/types.ts for data structure definitions
