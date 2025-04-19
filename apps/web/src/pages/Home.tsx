import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@project-board/ui';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <h1 className="text-4xl font-bold text-center mb-4">
        Find teammates for your CS projects
      </h1>
      <p className="text-xl text-gray-600 text-center max-w-2xl mb-8">
        Project Board connects computer science students with peers who have the skills they need.
        Post your project idea or browse existing projects to find your next collaboration.
      </p>
      
      <div className="flex space-x-4">
        <Link to="/projects">
          <Button variant="primary" size="lg">
            Browse Projects
          </Button>
        </Link>
        <Button variant="outline" size="lg">
          Create Project
        </Button>
      </div>
      
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        <FeatureCard 
          title="Find the right skills" 
          description="Filter projects by skills you're looking for or add your skills to projects you create." 
        />
        <FeatureCard 
          title="Connect with peers" 
          description="Build your network with fellow CS students who share your interests." 
        />
        <FeatureCard 
          title="Build your portfolio" 
          description="Collaborate on real projects to enhance your resume and GitHub profile." 
        />
      </div>
    </div>
  );
};

interface FeatureCardProps {
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default Home; 