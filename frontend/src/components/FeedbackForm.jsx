import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPaperPlane, FaTimes, FaHeart, FaCheckCircle } from 'react-icons/fa';

const FeedbackForm = ({ onClose, isModal = false }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [showThankYou, setShowThankYou] = useState(false);

  // Function to store feedback in localStorage
  const storeFeedbackLocally = (feedback) => {
    try {
      // Get existing feedback from localStorage
      const existingFeedback = JSON.parse(localStorage.getItem('recipedia_feedback') || '[]');
      
      // Add new feedback with timestamp
      const newFeedback = {
        ...feedback,
        timestamp: new Date().toISOString(),
        id: Date.now().toString()
      };
      
      // Add to beginning of array (most recent first)
      existingFeedback.unshift(newFeedback);
      
      // Keep only the last 10 feedback entries
      const limitedFeedback = existingFeedback.slice(0, 10);
      
      // Store back to localStorage
      localStorage.setItem('recipedia_feedback', JSON.stringify(limitedFeedback));
      
      console.log('Feedback stored locally:', newFeedback);
    } catch (error) {
      console.error('Error storing feedback locally:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Store feedback locally first
      storeFeedbackLocally(formData);
      
      // Simulate API call - replace with actual endpoint
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For now, we'll just log the feedback (in real implementation, send to backend)
      console.log('Feedback submitted:', formData);
      
      // Show thank you message
      setShowThankYou(true);
      setSubmitStatus('success');
      
      // Reset form
      const submittedData = { ...formData };
      setFormData({ name: '', email: '', message: '' });
      
      // Navigate to homepage after showing thank you message
      setTimeout(() => {
        if (isModal) {
          onClose && onClose();
        }
        // Navigate to homepage after 3 seconds
        navigate('/');
      }, 3000);
      
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formContent = (
    <div className={`feedback-form ${isModal ? 'modal-content' : 'page-content'}`}>
      {isModal && (
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Share Your Feedback</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            aria-label="Close feedback form"
          >
            <FaTimes size={20} />
          </button>
        </div>
      )}

      {!isModal && (
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">We Value Your Feedback</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Your thoughts and suggestions help us improve Recipedia. Share your experience, report issues, 
            or suggest new features - we're always listening!
          </p>
        </div>
      )}

      {submitStatus === 'success' && showThankYou && (
        <div className="mb-6 p-8 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 text-green-800 rounded-xl text-center animate-pulse">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <FaCheckCircle className="text-4xl text-green-500 animate-bounce" />
              <FaHeart className="text-lg text-red-500 absolute -top-1 -right-1 animate-ping" />
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-2 text-green-700">Thank You for Your Feedback! 🎉</h3>
          <p className="text-lg mb-2">We truly appreciate your valuable input!</p>
          <p className="text-sm text-green-600">Your feedback has been saved and will help us improve Recipedia.</p>
          <p className="text-sm text-green-500 mt-3 font-medium">Redirecting you to the homepage in a moment...</p>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <p className="font-semibold">Oops! Something went wrong.</p>
          <p className="text-sm">Please try again later or contact us directly.</p>
        </div>
      )}

      {!showThankYou && (
        <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors"
            placeholder="Your full name"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors"
            placeholder="your.email@example.com"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Message <span className="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            required
            rows="6"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-vertical transition-colors"
            placeholder="Share your thoughts, suggestions, or report issues..."
          />
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Minimum 10 characters ({formData.message.length}/10)
          </p>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting || formData.message.length < 10}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Submitting...
              </>
            ) : (
              <>
                <FaPaperPlane />
                Submit Feedback
              </>
            )}
          </button>
          
          <button
            type="button"
            onClick={isModal ? onClose : () => navigate('/')}
            className="px-6 py-3 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            Cancel
          </button>
        </div>
      </form>
      )}
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
          {formContent}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {formContent}
    </div>
  );
};

export default FeedbackForm;
