import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";
import "./styles/animations.css";

// Reusable and Core Page Imports with .jsx extension
import RecipeListPage from "./pages/RecipeListPage.jsx";
import RecipeDetailPage from "./pages/RecipeDetailPage.jsx";
import RecipeHome from "./pages/RecipeHome.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import UserProfile from "./pages/UserProfile.jsx";
import AddRecipe from "./pages/AddRecipe.jsx";
import About from "./pages/About.jsx";
import NotFound from './pages/NotFound.jsx';
import ErrorPage from './pages/ErrorPage.jsx';

// Component Imports with .jsx extension
import Header from "./components/Header.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import Footer from "./components/Footer.jsx";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("username");
    setIsLoggedIn(!!user);
  }, []);

  return (
    <Router>
      <div className="app-container min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
        <ScrollToTop />
        <Header />
        <Routes>
          {/* Core Routes */}
          <Route path="/" element={<RecipeHome />} />
          <Route path="/home" element={<RecipeHome />} />
          <Route path="/login" element={<div className="login-bg"><Login setIsLoggedIn={setIsLoggedIn} /></div>} />
          <Route path="/register" element={<div className="register-bg"><Register setIsLoggedIn={setIsLoggedIn} /></div>} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/add-recipe" element={<AddRecipe />} />
          <Route path="/about" element={<About />} />
          
          {/* Dynamic Category List Pages */}
          <Route path="/veg" element={<RecipeListPage category="veg" />} />
          <Route path="/nonveg" element={<RecipeListPage category="nonveg" />} />
          <Route path="/dessert" element={<RecipeListPage category="dessert" />} />
          <Route path="/beverages" element={<RecipeListPage category="beverages" />} />

          {/* Dynamic Recipe Detail Page */}
          {/* This one route handles ALL recipe details */}
          <Route path="/recipes/:category/:recipeId" element={<RecipeDetailPage />} />
          
          {/* Error and Fallback Routes */}
          <Route path="/error" element={<ErrorPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;