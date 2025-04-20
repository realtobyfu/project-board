import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Button } from '@project-board/ui';
import { useAuth } from '../contexts/AuthContext';

const Signup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { signUp, user } = useAuth();

  // If already logged in, redirect to projects page
  if (user) {
    return <Navigate to="/projects" />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Simple password validation
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await signUp(email, password);
      if (error) {
        setError(error.message);
      } else {
        setSuccessMessage(
          'Registration successful! Please check your email to confirm your account.'
        );
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-card relative">
      {/* Decorative elements */}
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-neon-300 rounded-full filter blur-3xl opacity-10 animate-pulse-slow"></div>
      <div className="absolute -left-20 bottom-10 w-40 h-40 bg-midnight-800 rounded-full filter blur-3xl opacity-10 animate-pulse-slow"></div>

      <h1 className="text-2xl font-bold mb-6 text-center font-space-grotesk">
        <span className="bg-gradient-text bg-clip-text text-transparent">
          Sign up for Project Board
        </span>
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

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-midnight-700 mb-2"
          >
            Confirm Password<span className="text-neon-500 ml-1">*</span>
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neon-400 focus:border-transparent"
            required
          />
        </div>

        <Button type="submit" variant="neon" className="w-full" disabled={isLoading}>
          {isLoading ? 'Signing up...' : 'Sign up'}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-midnight-600">
          Already have an account?{' '}
          <Link to="/login" className="text-neon-600 hover:underline font-medium">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
