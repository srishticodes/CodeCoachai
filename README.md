# CodeCoach.ai - AI-Powered Coding Interview Practice Platform

CodeCoach.ai is an intelligent learning platform designed to help developers master coding interview skills through AI-powered practice sessions. The platform provides personalized coding challenges, instant feedback, and comprehensive learning resources to prepare users for technical interviews.

## 🚀 What is CodeCoach.ai?

CodeCoach.ai combines the power of Google's Gemini AI with a modern web interface to create an interactive coding practice environment. Whether you're preparing for your first technical interview or looking to sharpen your algorithmic skills, CodeCoach.ai provides the tools and guidance you need to succeed.

## ✨ Key Features

### 🤖 AI-Generated Questions
- **Dynamic Content**: Questions are generated on-demand using advanced AI, ensuring fresh and relevant challenges
- **Personalized Difficulty**: Questions adapt to your skill level and learning progress
- **Multiple Categories**: Practice with arrays, strings, dynamic programming, trees, graphs, and more
- **Language Support**: Code in JavaScript, Python, Java, or C++

### 💻 Interactive Coding Environment
- **Monaco Editor**: Professional-grade code editor with syntax highlighting and autocomplete
- **Real-time Execution**: Test your code against multiple test cases instantly
- **Smart Feedback**: Get detailed explanations of why your solution works or where it fails
- **Performance Analysis**: Understand time and space complexity of your solutions

### 🎯 Intelligent Learning System
- **Adaptive Hints**: Get progressive hints when you're stuck, without spoiling the solution
- **Step-by-step Explanations**: Learn optimal approaches with detailed solution breakdowns
- **Progress Tracking**: Monitor your improvement across different categories and difficulty levels
- **Performance Metrics**: Track your success rate, average solve time, and areas for improvement

### 🔐 User Management
- **Secure Authentication**: Google OAuth integration for seamless login
- **Personal Profiles**: Save your progress and preferences
- **Practice History**: Review your past attempts and solutions
- **Customizable Settings**: Adjust difficulty, language, and category preferences

## 🏗️ Architecture

### Frontend (React + Vite)
- **Modern UI**: Built with React and styled with Tailwind CSS
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Updates**: Live feedback and progress tracking
- **Code Editor**: Monaco Editor integration for professional coding experience

### Backend (Node.js + Express)
- **RESTful API**: Clean, well-documented API endpoints
- **AI Integration**: Google Gemini AI for question generation and evaluation
- **Database**: MongoDB for storing questions, user progress, and solutions
- **Authentication**: JWT-based authentication with Google OAuth support

### AI Services
- **Question Generation**: AI creates unique, contextually relevant coding challenges
- **Solution Evaluation**: Intelligent assessment of code correctness and efficiency
- **Hint System**: Progressive hints that guide without giving away solutions
- **Explanation Engine**: Detailed breakdowns of optimal solutions and approaches

## 🎮 How It Works

1. **Start Practicing**: Choose your preferred language and difficulty level
2. **Get Questions**: AI generates personalized coding challenges based on your preferences
3. **Code & Test**: Write your solution in the integrated code editor and run test cases
4. **Get Feedback**: Receive instant feedback on correctness, performance, and optimization
5. **Learn & Improve**: Access hints, solutions, and detailed explanations to enhance your skills
6. **Track Progress**: Monitor your improvement across different problem categories

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI framework
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Monaco Editor** - Professional code editor
- **React Router** - Client-side routing

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **JWT** - Authentication tokens
- **Passport.js** - OAuth authentication

### AI & External Services
- **Google Gemini AI** - Question generation and evaluation
- **Google OAuth** - User authentication
- **Code Execution Engine** - Safe code evaluation

## 📁 Project Structure

```
coach/
├── frontend-new/          # React frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── context/       # React context providers
│   │   ├── services/      # API service layer
│   │   └── main.jsx       # Application entry point
│   └── package.json
├── backend/               # Node.js backend application
│   ├── src/
│   │   ├── controllers/   # Request handlers
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic & AI integration
│   │   └── middleware/    # Express middleware
│   └── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- MongoDB database
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd coach
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   # Create .env file with your configuration
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend-new
   npm install
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000


