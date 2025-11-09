import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Header from "./components/homepage/Header";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import HomePage from "./pages/HomePage";
import Profile from "./pages/Profile";
import EventDetail from "./pages/EventDetails";
import { CreateEvent } from "./pages/CreateEvent";
import ProtectedRoute from "./components/ProtectedRoute";
import EditEvent from "./pages/EditEvent";

// ---------- Layout Components ----------

// Layout for all protected (authenticated) pages
function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-container">
      <Header searchTerm={""} onSearchChange={() => {}} />
      <main>{children}</main>
    </div>
  );
}

// Layout for public (unauthenticated) pages like Login and Signup
function PublicLayout({ children }: { children: React.ReactNode }) {
  return <div className="public-container">{children}</div>;
}

// ---------- Conditional Root Redirect ----------

function RootRedirect() {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;
  return user ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />;
}

// ---------- Account Shortcut ----------

function Account() {
  const { user } = useAuth();
  if (!user) return <p>Loading...</p>;
  return <Navigate to={`/profile/${user._id}`} replace />;
}

// ---------- Main App ----------

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Root redirect based on auth state */}
          <Route path="/" element={<RootRedirect />} />

          {/* ---------- Public Routes ---------- */}
          <Route
            path="/login"
            element={
              <PublicLayout>
                <Login />
              </PublicLayout>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicLayout>
                <SignUp />
              </PublicLayout>
            }
          />

          {/* ---------- Protected Routes ---------- */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <HomePage />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <Account />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/:id"
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <Profile />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-event"
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <CreateEvent />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/events/:id"
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <EventDetail />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/events/edit/:id"
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <EditEvent />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route
            path="*"
            element={<p>Page not found. Go to <a href="/home">Home</a></p>}
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
