# AI Interview Coach

A full-stack application for practicing coding interviews with AI-powered feedback and evaluation.

## Features

- User authentication and profile management
- Interactive coding environment with Monaco Editor
- Real-time code execution and evaluation
- Interview session management
- Progress tracking and statistics
- Dark mode support

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- npm or yarn

## Project Structure

```
.
├── backend/           # Express.js backend
│   ├── src/
│   │   ├── config/   # Configuration files
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── index.js
│   └── package.json
│
└── frontend/         # React frontend
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   ├── utils/
    │   └── App.jsx
    └── package.json
```

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd ai-interview-coach
   ```

2. Set up the backend:
   ```bash
   cd backend
   
   # Create .env file from example
   cp .env.example .env
   
   # Install dependencies
   npm install
   
   # Start MongoDB (make sure MongoDB is installed)
   # On Windows:
   mongod
   # On macOS/Linux:
   sudo service mongod start
   
   # Start the backend server
   npm run dev
   ```

3. Set up the frontend:
   ```bash
   cd frontend
   
   # Install dependencies
   npm install
   
   # Start the development server
   npm run dev
   ```

4. Access the application:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## Environment Variables

### Backend (.env)

Create a `.env` file in the backend directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/ai-interview-coach

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
JWT_REFRESH_EXPIRES_IN=30d

# CORS Configuration
FRONTEND_URL=http://localhost:5173
```

## Development

- Backend development server: `npm run dev` (in backend directory)
- Frontend development server: `npm run dev` (in frontend directory)
- Backend tests: `npm test` (in backend directory)

## Production Build

1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. Start the production server:
   ```bash
   cd backend
   npm start
   ```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🚀 Features

- **AI-Powered Evaluation**: Get instant feedback on your code and explanations
- **Real-time Code Execution**: Test your solutions with Judge0 integration
- **Interactive Code Editor**: VS Code-like experience with Monaco Editor
- **Progress Tracking**: Visualize your improvement with detailed analytics
- **Smart Hint System**: Get progressive hints based on your approach
- **Multiple Languages**: Support for JavaScript, Python, Java, and C++

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Node.js + Express + MongoDB
- **Code Execution**: Judge0 API
- **AI Evaluation**: OpenAI GPT API
- **Code Editor**: Monaco Editor
- **Authentication**: JWT

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn
- OpenAI API key
- Judge0 API key

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-interview-coach
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Environment Setup**
   Create `.env` files in both frontend and backend directories:

   Backend (.env):
   ```
   MONGODB_URI=mongodb://localhost:27017/ai-interview-coach
   JWT_SECRET=your-jwt-secret
   OPENAI_API_KEY=your-openai-key
   JUDGE0_API_KEY=your-judge0-key
   PORT=5000
   ```

   Frontend (.env):
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start Development Servers**
   ```bash
   npm run dev
   ```
   This will start both frontend (port 3000) and backend (port 5000) servers.

## 📁 Project Structure

```
ai-interview-coach/
├── frontend/                 # React + Vite frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context providers
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API services
│   │   └── utils/          # Utility functions
│   └── public/             # Static assets
├── backend/                 # Node.js + Express backend
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   └── utils/          # Utility functions
│   └── config/             # Configuration files
└── docker-compose.yml      # Docker configuration
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Questions
- `GET /api/questions` - Get all questions
- `GET /api/questions/:id` - Get specific question

### Interview
- `POST /api/interview/start` - Start new interview session
- `PUT /api/interview/:id` - Update interview session

### Submissions
- `POST /api/submissions/execute` - Execute code submission
- `GET /api/submissions/:id` - Get submission details

### Feedback
- `POST /api/feedback/evaluate` - Get AI evaluation
- `GET /api/feedback/:sessionId` - Get session feedback

## 🙏 Acknowledgments

- OpenAI for GPT API
- Judge0 for code execution
- Monaco Editor for the code editor
- All other open-source contributors 