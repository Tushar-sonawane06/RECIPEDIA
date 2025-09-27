import React from 'react';
import FeedbackForm from '../components/FeedbackForm';
import { FaComments, FaBug, FaLightbulb, FaHeart } from 'react-icons/fa';

const Feedback = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <FaComments className="text-4xl text-amber-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
              Feedback & Support
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Help us make Recipedia better! Your feedback is invaluable in creating the best recipe-sharing experience.
          </p>
        </div>

        {/* Feedback Categories */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-3">
              <FaBug className="text-2xl text-red-500 mr-3" />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Report Issues</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Found a bug or something not working as expected? Let us know so we can fix it quickly.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-3">
              <FaLightbulb className="text-2xl text-yellow-500 mr-3" />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Suggest Features</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Have ideas for new features or improvements? We'd love to hear your creative suggestions.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-3">
              <FaHeart className="text-2xl text-pink-500 mr-3" />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">General Feedback</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Share your overall experience, what you love, or what could be better about Recipedia.
            </p>
          </div>
        </div>

        {/* Main Feedback Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <FeedbackForm isModal={false} />
        </div>

        {/* Additional Support Information */}
        <div className="mt-12 text-center">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Other Ways to Reach Us
          </h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="mailto:support@recipedia.com"
              className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              Email Support
            </a>
            <span className="text-gray-500 dark:text-gray-400">or</span>
            <div className="text-gray-600 dark:text-gray-300">
              Phone: <span className="font-medium">+91-123-456-7890</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            We typically respond within 24-48 hours during business days.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
