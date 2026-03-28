import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./components/AuthPage/AuthPage";
import HomePage from "./components/HomePage/HomePage";
import Blog from "./components/BlogPage/Blog";
import Quiz from "./components/QuizPage/Quiz";
import DiyRemedies from "./components/DiyRemedies/DiyRemedies";
import ProfileSettings from "./components/ProfileSettings/ProfileSettings";
import FacialAnalysis from "./components/FacialAnalysis/FacialAnalysis";
import ProductsPageEnhanced from "./components/ProductsPage/ProductsPage";
import SkinEssentials from "./components/SkinEssentials/SkinEssentials";
import SkinReports from "./components/SkinReports/SkinReports";
import PrivateRoute from "./components/PrivateRoute";
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route 
          path="/home" 
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/blog" 
          element={
            <PrivateRoute>
              <Blog />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/diy-remedies" 
          element={
            <PrivateRoute>
              <DiyRemedies />
            </PrivateRoute>
          } 
        />
        <Route
          path="/quiz" 
          element={
            <PrivateRoute>
              <Quiz />
            </PrivateRoute>
          } 
        />
        <Route
          path="/profile-settings" 
          element={
            <PrivateRoute>
              <ProfileSettings />
            </PrivateRoute>
          } 
        />
        <Route
          path="/facial-analysis" 
          element={
            <PrivateRoute>
              <FacialAnalysis />
            </PrivateRoute>
          } 
        />
        <Route
          path="/products" 
          element={
            <PrivateRoute>
              <ProductsPageEnhanced />
            </PrivateRoute>
          } 
        />
        <Route
          path="/skin-essentials" 
          element={
            <PrivateRoute>
              <SkinEssentials />
            </PrivateRoute>
          } 
        />
        <Route
          path="/my-skin-reports" 
          element={
            <PrivateRoute>
              <SkinReports />
            </PrivateRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
