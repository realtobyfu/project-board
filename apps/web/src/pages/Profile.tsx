import React from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@project-board/ui';
import { useAuth } from '../contexts/AuthContext';

const Profile: React.FC = () => {
  const { user, signOut, deleteAccount, loading } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  const [deleteError, setDeleteError] = React.useState<string | null>(null);

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

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    setDeleteError(null);
    try {
      const { error } = await deleteAccount();
      if (error) {
        setDeleteError(error.message);
      } else {
        // If successful, sign out
        await signOut();
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      setDeleteError('An unexpected error occurred');
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

      <div className="border-t pt-6 mt-8">
        <h2 className="text-lg font-medium mb-4 text-red-600">Danger Zone</h2>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="font-medium text-red-800 mb-2">Delete Account</h3>
          <p className="text-sm text-red-700 mb-4">
            Once you delete your account, there is no going back. All your projects will be permanently deleted.
          </p>
          
          {!showDeleteConfirm ? (
            <Button
              onClick={() => setShowDeleteConfirm(true)}
              variant="outline"
              className="bg-white text-red-600 border-red-300 hover:bg-red-50"
            >
              Delete My Account
            </Button>
          ) : (
            <div className="space-y-3">
              <p className="text-sm font-medium text-red-800">
                Are you absolutely sure? This action cannot be undone.
              </p>
              
              {deleteError && (
                <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                  <p className="text-sm text-yellow-800">{deleteError}</p>
                </div>
              )}
              
              <div className="flex gap-3">
                <Button
                  onClick={handleDeleteAccount}
                  variant="danger"
                  disabled={isLoading}
                >
                  {isLoading ? 'Deleting...' : 'Yes, Delete My Account'}
                </Button>
                <Button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteError(null);
                  }}
                  variant="outline"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <Button
          onClick={handleSignOut}
          variant="outline"
          className="bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
          disabled={isLoading}
        >
          {isLoading ? 'Signing out...' : 'Sign out'}
        </Button>
      </div>
    </div>
  );
};

export default Profile;
