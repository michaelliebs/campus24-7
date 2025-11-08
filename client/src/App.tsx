import './App.css'
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom'; 
import Header from './components/homepage/Header';
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import HomePage from './pages/HomePage';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './pages/Profile';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />

        <Routes>
          {/* Redirect root "/" to "/home" */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          
          {/* Protected route */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/:id"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<p>Page not found. Go to <a href="/home">Home</a></p>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

function Account() {
  const { user } = useAuth();

  if (!user) return <p>Loading...</p>;

  // Redirect to the user's profile page
  return <Navigate to={`/profile/${user._id}`} replace />;
}

export default App
