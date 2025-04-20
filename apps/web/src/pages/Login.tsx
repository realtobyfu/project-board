import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Button } from '@project-board/ui';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const { signIn, signInWithGitHub, resetPassword, user } = useAuth();

  // If already logged in, redirect to projects page
  if (user) {
    return <Navigate to="/projects" />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      if (isResetMode) {
        // Handle password reset
        const { error } = await resetPassword(email);
        if (error) {
          setError(error.message);
        } else {
          setSuccessMessage('Password reset link sent to your email');
        }
      } else {
        // Handle regular login
        const { error } = await signIn(email, password);
        if (error) {
          setError(error.message);
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGitHubLogin = async () => {
    setError(null);
    try {
      const { error } = await signInWithGitHub();
      if (error) {
        setError(error.message);
      }
    } catch (err) {
      setError('Failed to initialize GitHub login');
      console.error(err);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-card">
      {/* Decorative elements */}
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-neon-300 rounded-full filter blur-3xl opacity-10 animate-pulse-slow"></div>
      <div className="absolute -left-20 bottom-10 w-40 h-40 bg-midnight-800 rounded-full filter blur-3xl opacity-10 animate-pulse-slow"></div>

      <h1 className="text-2xl font-bold mb-6 text-center font-space-grotesk">
        {isResetMode ? (
          <span className="bg-gradient-text bg-clip-text text-transparent">
            Reset Your Password
          </span>
        ) : (
          <span className="bg-gradient-text bg-clip-text text-transparent">
            Log in to Project Board
          </span>
        )}
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl mb-4">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-midnight-700 mb-2">
            Email<span className="text-neon-500 ml-1">*</span>
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neon-400 focus:border-transparent"
            required
          />
        </div>

        {!isResetMode && (
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-midnight-700 mb-2">
              Password<span className="text-neon-500 ml-1">*</span>
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neon-400 focus:border-transparent"
              required
            />
          </div>
        )}

        <Button type="submit" variant="neon" className="w-full" disabled={isLoading}>
          {isLoading ? 'Processing...' : isResetMode ? 'Send Reset Link' : 'Log in'}
        </Button>
      </form>

      {!isResetMode && (
        <>
          <div className="relative flex items-center my-6">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink mx-4 text-gray-400 text-sm">or</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          <div>
            <Button
              onClick={handleGitHubLogin}
              variant="dark"
              className="w-full flex items-center justify-center"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 mr-2" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              Continue with GitHub
            </Button>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsResetMode(true)}
              className="text-neon-600 hover:underline text-sm font-medium"
              type="button"
            >
              Forgot your password?
            </button>
          </div>
        </>
      )}

      <div className="mt-6 text-center">
        {isResetMode ? (
          <button
            onClick={() => setIsResetMode(false)}
            className="text-neon-600 hover:underline font-medium"
            type="button"
          >
            Back to login
          </button>
        ) : (
          <p className="text-midnight-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-neon-600 hover:underline font-medium">
              Sign up
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
