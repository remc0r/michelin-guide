import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Restaurants from "./pages/Restaurants";
import RestaurantDetail from "./pages/RestaurantDetail";
import Hotels from "./pages/Hotels";
import Magazine from "./pages/Magazine";
import ArticleDetail from "./pages/ArticleDetail";
import Reservation from "./pages/Reservation";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Feed from "./pages/Feed";
import Friends from "./pages/Friends";
import MyReservations from "./pages/MyReservations";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ErrorBoundary from "./components/ErrorBoundary";
import { Toaster } from "./components/ui/sonner";

// Protected route component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <ErrorBoundary>
      <div className="App">
        <BrowserRouter>
          <Navbar />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/restaurants" element={<Restaurants />} />
            <Route path="/restaurants/:slug" element={<RestaurantDetail />} />
            <Route path="/hotels" element={<Hotels />} />
            <Route path="/magazine" element={<Magazine />} />
            <Route path="/magazine/:slug" element={<ArticleDetail />} />
            <Route path="/reservation/:slug" element={
              <ProtectedRoute>
                <Reservation />
              </ProtectedRoute>
            } />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes */}
            <Route path="/feed" element={
              <ProtectedRoute>
                <Feed />
              </ProtectedRoute>
            } />
            <Route path="/friends" element={
              <ProtectedRoute>
                <Friends />
              </ProtectedRoute>
            } />
            <Route path="/my-reservations" element={
              <ProtectedRoute>
                <MyReservations />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <div className="max-w-4xl mx-auto px-6 py-12">
                  <h1 className="text-3xl font-bold text-black mb-6">Mon profil</h1>
                  <p className="text-gray-600">Profil en cours de développement...</p>
                </div>
              </ProtectedRoute>
            } />
          </Routes>
          <Footer />
          <Toaster position="bottom-right" />
        </BrowserRouter>
      </div>
    </ErrorBoundary>
  );
}

export default App;
