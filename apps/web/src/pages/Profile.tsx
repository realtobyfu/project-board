import React from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@project-board/ui';
import { useAuth } from '../contexts/AuthContext';

const Profile: React.FC = () => {
  const { user, signOut, loading } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);

  // If not logged in, redirect to login page
  if (!loading && !user) {
    return <Navigate to="/login" />;
  }

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading profile...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Your Profile</h1>

      <div className="mb-6">
        <h2 className="text-lg font-medium mb-2">Account Information</h2>
        <div className="bg-gray-50 p-4 rounded-md">
          <p className="mb-2">
            <span className="font-medium">Email:</span> {user?.email}
          </p>
          <p>
            <span className="font-medium">User ID:</span> {user?.id}
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleSignOut}
          variant="outline"
          className="bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
          disabled={isLoading}
        >
          {isLoading ? 'Signing out...' : 'Sign out'}
        </Button>
      </div>
    </div>
  );
};

export default Profile;
