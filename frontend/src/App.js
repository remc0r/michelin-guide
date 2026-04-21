import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Restaurants from "./pages/Restaurants";
import RestaurantDetail from "./pages/RestaurantDetail";
import Hotels from "./pages/Hotels";
import Magazine from "./pages/Magazine";
import ArticleDetail from "./pages/ArticleDetail";
import Reservation from "./pages/Reservation";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/restaurants/:slug" element={<RestaurantDetail />} />
          <Route path="/hotels" element={<Hotels />} />
          <Route path="/magazine" element={<Magazine />} />
          <Route path="/magazine/:slug" element={<ArticleDetail />} />
          <Route path="/reservation/:slug" element={<Reservation />} />
        </Routes>
        <Footer />
        <Toaster position="bottom-right" />
      </BrowserRouter>
    </div>
  );
}

export default App;
