import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { Mail, Lock, Phone, MapPin, Calendar, ArrowRight, Eye, EyeOff, User, ChefHat, XCircle } from "lucide-react";

// --- START: Local Input Component (extracted and enhanced for errors) ---
// This component is defined OUTSIDE the Register component to prevent re-renders
const CustomFormInput = ({ icon: Icon, type = "text", name, value, onChange, placeholder, required, autoComplete, min, max, minLength, error, ...props }) => {
  return (
    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="relative w-full">
      {Icon && <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        min={min}
        max={max}
        minLength={minLength}
        className={`w-full border-2 rounded-lg px-10 py-2 text-sm outline-none transition ${
          error ? 'border-red-500 focus:border-red-500 text-red-900 placeholder-red-300' : 'focus:border-red-400 border-gray-300 text-gray-900 placeholder-gray-400'
        }`}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? `${name}-error` : undefined}
        {...props}
      />
      {error && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <XCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
        </div>
      )}
      {error && (
        <p className="mt-1 text-xs text-red-500 flex items-center gap-1" id={`${name}-error`}>
          {error}
        </p>
      )}
    </motion.div>
  );
};
// --- END: Local Input Component ---


const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    age: "",
    gender: "",
    phone: "",
    address: "",
    agreeTerms: false, // Renamed for clarity
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState(""); // For network/server errors
  const [fieldErrors, setFieldErrors] = useState({}); // For input-specific errors

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (generalError) setGeneralError("");
  };

  const togglePassword = () => setShowPassword((prev) => !prev);

  const validateForm = () => {
    const { username, email, password, age, gender, phone, agreeTerms } = formData; // Address can be optional
    let errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // const phoneRegex = /^\+?[1-9]\d{1,14}$/; // Example regex, adjust as needed

    if (!username.trim()) {
      errors.username = "Username is required";
    } else if (username.trim().length < 3) { // Example: min length for username
      errors.username = "Username must be at least 3 characters";
    }

    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(email.trim())) {
      errors.email = "Please enter a valid email address";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters long";
    }

    if (!age) {
      errors.age = "Age is required";
    } else if (parseInt(age) < 1 || parseInt(age) > 120) {
      errors.age = "Age must be between 1 and 120";
    }

    if (!gender) errors.gender = "Gender is required";

    // Uncomment and refine if phone is required or needs strict format validation
    // if (phone.trim() && !phoneRegex.test(phone.trim())) {
    //   errors.phone = "Please enter a valid phone number";
    // }

    if (!agreeTerms) errors.agreeTerms = "You must agree to the Terms of Use & Privacy Policy";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setGeneralError("");
    setFieldErrors({});

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/register`, // Ensure this endpoint is correct
        {
          username: formData.username.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          age: parseInt(formData.age),
          gender: formData.gender,
          phone: formData.phone.trim(),
          address: formData.address.trim(),
        }
      );

      if (response.status === 201) {
        navigate("/login");
      } else {
        setGeneralError("Registration successful, but an unexpected status was returned.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      if (err.response) {
        setGeneralError(err.response.data?.message || "Registration failed. Please try again.");
      } else if (err.request) {
        setGeneralError("Cannot connect to server. Please check your internet connection.");
      } else {
        setGeneralError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-pink-50 to-white p-4">
      <form className="bg-white rounded-lg shadow-md w-full max-w-sm space-y-4 p-6 border-t-4 border-red-400" onSubmit={handleSubmit}>
        <motion.div className="flex items-center justify-center mb-4" initial={{ y: -10 }} animate={{ y: 0 }} whileHover={{ scale: 1.05, rotate: [0, 5, -5, 0] }}>
          <div className="bg-red-400 rounded-lg flex items-center justify-center w-12 h-12">
            <ChefHat className="w-5 h-5 text-white" />
          </div>
        </motion.div>

        <h2 className="text-xl font-bold text-center text-red-500">Recipedia</h2>
        <p className="text-xs text-center text-gray-500">Join Recipedia! Create your account and start your culinary adventure</p>

        {generalError && <p className="text-red-500 text-xs text-center">{generalError}</p>}


        {/* Username */}
        <CustomFormInput placeholder="Username" name="username" value={formData.username} onChange={handleInputChange} icon={User} required error={fieldErrors.username} />
        {/* Email */}
        <CustomFormInput placeholder="Email" type="email" name="email" value={formData.email} onChange={handleInputChange} icon={Mail} required error={fieldErrors.email} />

        {/* Password */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password (min 8 chars)"
            value={formData.password}
            onChange={handleInputChange}
            minLength={8}
            required
            autoComplete="new-password"
            className={`w-full border-2 rounded-lg px-10 py-2 text-sm outline-none transition ${
              fieldErrors.password ? 'border-red-500 focus:border-red-500 text-red-900 placeholder-red-300' : 'focus:border-red-400 border-gray-300 text-gray-900 placeholder-gray-400'
            }`}
            aria-invalid={fieldErrors.password ? "true" : "false"}
            aria-describedby={fieldErrors.password ? "password-error" : undefined}
          />
          <span
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 z-10"
            onClick={togglePassword}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </span>
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          {fieldErrors.password && (
            <p className="mt-1 text-xs text-red-500 flex items-center gap-1" id="password-error">
              {fieldErrors.password}
            </p>
          )}
        </div>


        <div className="grid grid-cols-2 gap-2">
          {/* Age */}
          <CustomFormInput placeholder="Age" type="number" name="age" value={formData.age} onChange={handleInputChange} icon={Calendar} min="1" max="120" required error={fieldErrors.age} />

          {/* Gender Select */}
          <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="relative w-full">
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              required
              className={`w-full border-2 rounded-lg pl-3 pr-8 py-2 text-sm outline-none appearance-none transition bg-white cursor-pointer ${
                fieldErrors.gender ? 'border-red-500 focus:border-red-500 text-red-900' : 'focus:border-red-400 border-gray-300 text-gray-400'
              }`}
              aria-invalid={fieldErrors.gender ? "true" : "false"}
              aria-describedby={fieldErrors.gender ? "gender-error" : undefined}
            >
              <option value="" disabled hidden>Select Gender</option>
              <option value="male" className="text-black">Male</option>
              <option value="female" className="text-black">Female</option>
              <option value="other" className="text-black">Other</option>
              <option value="prefer-not-to-say" className="text-black">Prefer not to say</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
            {fieldErrors.gender && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1" id="gender-error">
                {fieldErrors.gender}
              </p>
            )}
          </motion.div>
        </div>

        {/* Phone */}
        <CustomFormInput placeholder="Phone (Optional)" type="tel" name="phone" value={formData.phone} onChange={handleInputChange} icon={Phone} error={fieldErrors.phone} />
        
        {/* Address Textarea */}
        <div className="relative">
          <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" /> {/* Align icon to top for textarea */}
          <textarea
            placeholder="Address (Optional)"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className={`w-full border-2 rounded-lg px-10 py-2 text-sm outline-none resize-none transition ${
              fieldErrors.address ? 'border-red-500 focus:border-red-500 text-red-900 placeholder-red-300' : 'focus:border-red-400 border-gray-300 text-gray-900 placeholder-gray-400'
            }`}
            rows="3"
            aria-invalid={fieldErrors.address ? "true" : "false"}
            aria-describedby={fieldErrors.address ? "address-error" : undefined}
          />
          {fieldErrors.address && (
            <p className="mt-1 text-xs text-red-500 flex items-center gap-1" id="address-error">
              {fieldErrors.address}
            </p>
          )}
        </div>

        {/* Terms and Conditions */}
        <motion.div className="flex items-start text-xs flex-col sm:flex-row gap-1" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-start">
            <input
              type="checkbox"
              id="agreeTerms"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleInputChange}
              className={`mr-2 w-3 h-3 mt-0.5 ${fieldErrors.agreeTerms ? 'border-red-500' : 'border-gray-300'}`}
            />
            <label htmlFor="agreeTerms" className="text-gray-600 cursor-pointer">
              I agree to the{" "}
              <Link to="/terms-of-use" className="text-red-500 underline cursor-pointer hover:text-red-600">
                Terms of Use
              </Link>{" "}
              &{" "}
              <Link to="/privacy-policy" className="text-red-500 underline cursor-pointer hover:text-red-600">
                Privacy Policy
              </Link>
            </label>
          </div>
          {fieldErrors.agreeTerms && (
            <p className="text-xs text-red-500 flex items-center gap-1">
              <XCircle size={12} /> {fieldErrors.agreeTerms}
            </p>
          )}
        </motion.div>

        {/* Create Account Button */}
        <motion.button
          type="submit"
          className="w-full bg-red-400 text-white py-1.5 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          disabled={loading}
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Creating Account...</span>
            </>
          ) : (
            <>
              <span>Create Account</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </motion.button>

        {/* Login Link */}
        <p className="text-center text-xs text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-red-500 underline cursor-pointer hover:text-red-600">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;