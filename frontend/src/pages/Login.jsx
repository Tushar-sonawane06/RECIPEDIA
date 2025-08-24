import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, XCircle } from 'lucide-react'; // Added XCircle for checkbox error

import AuthLayout from '../components/AuthLayout';
import FormInput from '../components/FormInput'; // Assuming this is updated or handles its own errors
import ErrorAlert from '../components/ErrorAlert'; // Assuming this is updated
import { authService } from '../services/authService';

const Login = ({ onAuthSuccess }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState(""); // For network/server/general form errors
  const [fieldErrors, setFieldErrors] = useState({}); // For input-specific validation errors

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear specific field error when user types
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (generalError) setGeneralError(""); // Clear general error on any input change
  };

  // Form validation
  const validateForm = () => {
    const { email, password } = formData;
    let errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      errors.email = "Email is required.";
    } else if (!emailRegex.test(email.trim())) {
      errors.email = "Please enter a valid email address.";
    }

    if (!password) {
      errors.password = "Password is required.";
    }

    if (!agreeTerms) {
      errors.agreeTerms = "You must agree to the Terms & Privacy Policy.";
    }

    setFieldErrors(errors); // Update field errors state
    return Object.keys(errors).length === 0; // Return true if no errors
  };

  // Handle form submit
  const handleLogin = async (e) => {
    e.preventDefault();

    setGeneralError(""); // Clear previous general errors
    setFieldErrors({}); // Clear previous field errors

    if (!validateForm()) {
      // If validation fails, errors are already set in fieldErrors
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/login`,
        {
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        }
      );

      const { token, user } = response.data;

      authService.setAuth(token, user);

      if (onAuthSuccess) {
        onAuthSuccess();
      }

      navigate("/home");
    } catch (err) {
      console.error("Login error:", err);
      if (err.response) {
        // More specific error handling for common login failures
        if (err.response.status === 401 || err.response.status === 400) {
          setGeneralError(err.response.data?.message || "Invalid credentials. Please try again.");
        } else {
          setGeneralError(err.response.data?.message || "Login failed. Please try again.");
        }
      } else if (err.request) {
        setGeneralError("Cannot connect to server. Please check your internet connection.");
      } else {
        setGeneralError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Framer Motion variants for staggered children animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08, // Slightly faster stagger for a snappier feel
        delayChildren: 0.1, // Slight delay before starting the stagger
      },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 250, damping: 25, mass: 0.5 },
    },
  };

  return (
    <div className="auth-page-container flex items-center justify-center min-h-screen p-4 font-sans antialiased">
      {/* AuthLayout's background animation will render here */}
      <AuthLayout
        title="Welcome Back!"
        subtitle="Sign in to continue your culinary journey"
        // Ensure AuthLayout handles its own container styling for the card
        className="bg-white rounded-2xl shadow-xl w-full max-w-md space-y-5 p-8 border-t-8 border-red-500 transform transition-all duration-300 hover:shadow-2xl"
      >
        <ErrorAlert error={generalError} onDismiss={() => setGeneralError("")} />

        <motion.form
          onSubmit={handleLogin}
          className="space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={childVariants}>
            <FormInput
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              required
              autoComplete="email"
              icon={Mail}
              error={fieldErrors.email}
            />
          </motion.div>

          <motion.div variants={childVariants}>
            <FormInput
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
              required
              autoComplete="current-password"
              icon={Lock}
              error={fieldErrors.password}
            />
          </motion.div>

          {/* Terms and Conditions */}
          <motion.div
            variants={childVariants}
            className="flex items-start text-xs sm:flex-row gap-1.5"
          >
            <div className="flex items-start flex-grow">
              <input
                type="checkbox"
                id="agreeTerms" // Renamed from 'terms' to 'agreeTerms' for consistency
                name="agreeTerms"
                checked={agreeTerms}
                onChange={(e) => {
                  setAgreeTerms(e.target.checked);
                  setFieldErrors((prev) => ({ ...prev, agreeTerms: "" })); // Clear error on change
                }}
                className={`mr-2 w-4 h-4 mt-0.5 rounded accent-red-500 cursor-pointer transition-colors duration-200
                  ${fieldErrors.agreeTerms ? 'border-red-500' : 'border-gray-300'}`}
              />
              <label htmlFor="agreeTerms" className="text-gray-700 cursor-pointer leading-tight">
                I agree to the{" "}
                <Link to="/terms-of-use" className="text-red-500 font-medium underline-offset-2 hover:text-red-600 hover:underline transition-colors duration-200">
                  Terms of Use
                </Link>{" "}
                &{" "}
                <Link to="/privacy-policy" className="text-red-500 font-medium underline-offset-2 hover:text-red-600 hover:underline transition-colors duration-200">
                  Privacy Policy
                </Link>
              </label>
            </div>
            {fieldErrors.agreeTerms && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <XCircle size={14} /> {fieldErrors.agreeTerms}
              </p>
            )}
          </motion.div>

          {/* Sign In Button */}
          <motion.button
            variants={childVariants}
            type="submit"
            className="w-full bg-red-500 text-white font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-red-600 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </motion.form>

        {/* Sign Up Link */}
        <motion.div
          className="text-center mt-8 pt-6 border-t border-gray-200 dark:border-slate-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <p className="text-gray-700 dark:text-gray-300 text-sm"> {/* Adjusted text color and size */}
            New to Recipedia?{" "}
            <Link
              to="/register"
              className="text-red-500 hover:text-red-600 font-semibold underline-offset-2 hover:underline transition-colors duration-200"
            >
              Create Account
            </Link>
          </p>
        </motion.div>
      </AuthLayout>
    </div>
  );
};

export default Login;