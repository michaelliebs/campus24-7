# campus24/7
#### Made by the students, for the students

# Project Overview
#### campus24/7 is a student-driven event-sharing platform designed to help college students connect beyond official clubs and organizations.

Students can:
- Create and share their own campus events (e.g., spikeball games, study sessions, movie nights).
- Show interest or RSVP to other student-run events.
- Discover activities happening in real time — on campus, by students, for students.

# Why We Built It
### Most campus events are organized by official clubs or school programs, leaving out spontaneous, casual student gatherings.
### With campus24/7, students take control — they can easily organize and promote their own activities, helping foster stronger community connections on campus.

# Tech Stack
### Frontend
- React + TypeScript
- Vite
- Axios
- CSS Modules
### Backend
- Node.js + Express
- MongoDB + Mongoose
- JSON Web Tokens (JWT) for authentication
- CORS + Cookie-based sessions

# Frontend Setup
Create a .env file inside the /client directory:
- VITE_API_URL=http://localhost:5000/api

### Installation
- cd client
- npm install

### Run the Frontend
- npm run dev

# Backend Setup
### MongoDB Requirements
- MongoDB running on port 27017
- Database named campus247

### Environment Variables
create .env inside the /server directory:
- MONGO_URI=mongodb://127.0.0.1:27017/campus247
- JWT_SECRET=
- CLIENT_URL=http://localhost:5173

##### Installation
- cd server
- npm install

##### Run the Backend
- npm run dev

# Getting Started
1. Start your MongoDB instance
2. Run the backend (server) first.
3. Run the frontend (client).
4. Visit http://localhost:5173 to begin exploring student-made events!
