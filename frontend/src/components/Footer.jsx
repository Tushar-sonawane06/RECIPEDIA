import React from "react";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer bg-gray-900 text-gray-300">
      <div className="footer-container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Logo & Mission */}
        <div className="footer-section about">
          <h4 className="text-xl font-semibold text-amber-400 mb-3">Recipedia</h4>
          <p className="text-sm leading-relaxed text-gray-400 mb-4">
            Your go-to platform for sharing and discovering delicious recipes from around the world.
            Join our food-loving community!
          </p>
          
          {/* Newsletter */}
          <div className="newsletter">
            <h4 className="text-lg font-semibold text-amber-400 mb-3">Subscribe to Our Newsletter</h4>
            <p className="text-sm text-gray-400 mb-4">
              Get the latest recipes, cooking tips, and exclusive offers delivered to your inbox.
            </p>
            <form className="newsletter-form">
              <div className="newsletter-input-group">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="newsletter-input"
                  required
                />
                <button type="submit" className="newsletter-button">
                  Subscribe
                </button>
              </div>
              <p className="newsletter-privacy text-xs text-gray-500 mt-2">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </form>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-section links">
          <h4 className="text-lg font-semibold text-amber-400 mb-3">Quick Links</h4>
          <ul>
            <li><a href="/" className="hover:text-white transition-colors duration-300">Home</a></li>
            <li><a href="/about" className="hover:text-white transition-colors duration-300">About</a></li>
            <li><a href="/add-recipe" className="hover:text-white transition-colors duration-300">Add Recipe</a></li>
            <li><a href="/profile" className="hover:text-white transition-colors duration-300">Profile</a></li>
            <li><a href="/privacy" className="hover:text-white transition-colors duration-300">Privacy</a></li>
            <li><a href="/terms-conditions" className="hover:text-white transition-colors duration-300">Terms</a></li>
          </ul>
        </div>

        {/* Categories */}
        <div className="footer-section links">
          <h4 className="text-lg font-semibold text-amber-400 mb-3">Categories</h4>
          <ul>
            <li><a href="/veg" className="transition-colors duration-300">Veg</a></li>
            <li><a href="/nonveg" className="transition-colors duration-300">Non-Veg</a></li>
            <li><a href="/dessert" className="transition-colors duration-300">Dessert</a></li>
            <li><a href="/beverages" className="transition-colors duration-300">Beverages</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-section">
          <h4 className="text-lg font-semibold text-amber-400 mb-3">Contact Us</h4>
          <p className="text-sm text-gray-400">
            Email:{" "}
            <a href="mailto:support@recipedia.com" className="hover:text-red-500 transition-colors duration-300">
              support@recipedia.com
            </a>
          </p>
          <p className="text-sm text-gray-400">Phone: +91-123-456-7890</p>

          {/* Follow Us moved below Contact Us */}
          <div className="footer-section mb-0 links mt-4">
            <h4 className="text-lg font-semibold mb-3">Follow Us</h4>
            <div className="social-icons flex space-x-6 text-2xl ">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 transition-colors duration-300"><FaFacebookF /></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 transition-colors duration-300"><FaXTwitter /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 transition-colors duration-300"><FaInstagram /></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 transition-colors duration-300"><FaLinkedinIn /></a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="footer-bottom mt-6 border-t border-gray-700 py-4 text-center text-sm text-gray-500">
        <div className="footer-legal space-x-3 mb-2">
          <a href="/privacy-policy" className="hover:underline">Privacy Policy</a>
          <span>|</span>
          <a href="/terms-of-use" className="hover:underline">Terms of Use</a>
        </div>
        <p>&copy; {new Date().getFullYear()} Recipedia. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;