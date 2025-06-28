# CodeCoach.ai - AI-Powered Coding Interview Practice Platform

CodeCoach.ai is an intelligent learning platform designed to help developers master coding interview skills through AI-powered practice sessions. The platform provides personalized coding challenges, instant feedback, and comprehensive learning resources to prepare users for technical interviews.

## 🚀 What is CodeCoach.ai?

CodeCoach.ai combines the power of Google's Gemini AI with a modern web interface to create an interactive coding practice environment. Whether you're preparing for your first technical interview or looking to sharpen your algorithmic skills, CodeCoach.ai provides the tools and guidance you need to succeed.

## 🎯 How CodeCoach.ai Works

### 1. **Landing Page Experience**
- **New Users**: Visit the homepage to see the platform introduction, features, and statistics
- **Returning Users**: After signing in, you can still access the main introduction page via the "Home" link in the navigation
- **Welcome Page**: Authenticated users can access a personalized welcome page at `/welcome`

### 2. **User Authentication**
- **Sign Up**: Create an account using email/password or Google OAuth
- **Sign In**: Access your personalized dashboard and practice history
- **Profile Management**: Update your preferences and view your progress

### 3. **Practice Workflow**

#### **Getting Started**
1. **Navigate to Practice**: Click "Practice" in the navigation or "Start Practicing" button
2. **Choose Preferences**: Select your preferred programming language and difficulty level
3. **Get Questions**: AI generates personalized coding challenges based on your settings

#### **Coding Session**
1. **Read the Problem**: Understand the problem statement and requirements
2. **Write Your Solution**: Use the integrated Monaco code editor with syntax highlighting
3. **Test Your Code**: Run your solution against multiple test cases
4. **Get Instant Feedback**: Receive detailed feedback on correctness and performance

#### **Learning & Improvement**
1. **Access Hints**: Get progressive hints when you're stuck (without spoiling the solution)
2. **View Solutions**: See optimal approaches with step-by-step explanations
3. **Performance Analysis**: Understand time and space complexity of your solutions
4. **Track Progress**: Monitor your improvement across different problem categories

### 4. **Dashboard & Progress**
- **Overview**: View your practice statistics, recent activity, and achievements
- **Progress Tracking**: Monitor your success rate, average solve time, and areas for improvement
- **Practice History**: Review your past attempts and solutions
- **Performance Metrics**: Track improvement across different categories and difficulty levels

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

## 🏗️ Technical Architecture

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

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- MongoDB database
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/srishticodes/CodeCoachai.git
   cd CodeCoachai
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




