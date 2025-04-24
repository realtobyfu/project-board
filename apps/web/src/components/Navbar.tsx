import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { user } = useAuth();
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="group relative">
              {/* Logo with gradient text */}
              <h1 className="text-2xl font-bold font-space-grotesk bg-gradient-neon bg-clip-text text-transparent">
                Project
                <span className="bg-gradient-midnight bg-clip-text text-transparent">Board</span>
              </h1>
              {/* Decorative element that appears on hover */}
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-neon-400 group-hover:w-full transition-all duration-300"></div>
            </Link>
          </div>

          <div className="flex items-center space-x-6">
            <Link
              to="/projects"
              className="text-midnight-800 hover:text-neon-600 font-medium transition-colors"
            >
              Browse Projects
            </Link>

            {user ? (
              <>
                <Link
                  to="/projects/new"
                  className="text-midnight-800 hover:text-neon-600 font-medium transition-colors"
                >
                  Create Project
                </Link>
                <Link
                  to="/profile"
                  className="text-midnight-800 hover:text-neon-600 font-medium transition-colors"
                >
                  Profile
                </Link>
              </>
            ) : (
              <div className="relative">
                <button
                  className="text-midnight-800 hover:text-neon-600 font-medium transition-colors flex items-center"
                  onClick={() => setShowAccountMenu(!showAccountMenu)}
                >
                  Account
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`ml-1 h-4 w-4 transition-transform duration-200 ${showAccountMenu ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {showAccountMenu && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white shadow-card border border-gray-100 py-1 z-10">
                    <Link
                      to="/login"
                      className="block px-4 py-2 text-midnight-800 hover:bg-gray-50 hover:text-neon-600"
                      onClick={() => setShowAccountMenu(false)}
                    >
                      Log in
                    </Link>
                    <Link
                      to="/signup"
                      className="block px-4 py-2 text-midnight-800 hover:bg-gray-50 hover:text-neon-600"
                      onClick={() => setShowAccountMenu(false)}
                    >
                      Sign up
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
