import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@project-board/ui';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

const UpdatePassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { updatePassword } = useAuth();
  const navigate = useNavigate();

  // Check if we have access token in URL (from password reset email)
  useEffect(() => {
    const handleHashParams = async () => {
      // Extract hash parameters
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');
      const type = hashParams.get('type');

      if (accessToken && type === 'recovery') {
        // Set the session using token
        await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken || '',
        });

        // Clear the URL hash
        window.history.replaceState(null, '', window.location.pathname);
      }
    };

    handleHashParams();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Validate password match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    // Validate password strength
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await updatePassword(password);

      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-card">
      {/* Decorative elements */}
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-neon-300 rounded-full filter blur-3xl opacity-10 animate-pulse-slow"></div>
      <div className="absolute -left-20 bottom-10 w-40 h-40 bg-midnight-800 rounded-full filter blur-3xl opacity-10 animate-pulse-slow"></div>

      <h1 className="text-2xl font-bold mb-6 text-center font-space-grotesk">
        <span className="bg-gradient-text bg-clip-text text-transparent">Update Your Password</span>
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4">
          {error}
        </div>
      )}

      {success ? (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl mb-4 text-center">
          <p>Your password has been updated successfully!</p>
          <p className="text-sm mt-2">Redirecting to login page...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-midnight-700 mb-2">
              New Password<span className="text-neon-500 ml-1">*</span>
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-neon-400 focus:border-transparent"
              required
              min={8}
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-midnight-700 mb-2"
            >
              Confirm New Password<span className="text-neon-500 ml-1">*</span>
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
            {isLoading ? 'Updating...' : 'Update Password'}
          </Button>
        </form>
      )}
    </div>
  );
};

export default UpdatePassword;
