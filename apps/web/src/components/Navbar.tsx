import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@project-board/ui';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-xl font-bold text-blue-600">
              Project Board
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/projects">
              <Button variant="outline" size="sm">
                Browse Projects
              </Button>
            </Link>
            <Button variant="primary" size="sm">
              Create Project
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 