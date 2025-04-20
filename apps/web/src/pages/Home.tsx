import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@project-board/ui';

const Home: React.FC = () => {
  return (
    <div className="py-12 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute -right-20 -top-20 w-80 h-80 bg-neon-300 rounded-full filter blur-3xl opacity-20 animate-pulse-slow"></div>
      <div className="absolute -left-32 top-40 w-72 h-72 bg-midnight-800 rounded-full filter blur-3xl opacity-10 animate-pulse-slow"></div>
      <div className="absolute right-20 bottom-10 w-40 h-40 bg-neon-100 rounded-full filter blur-xl opacity-30 animate-float"></div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        <h1 className="text-5xl font-bold text-center mb-6 font-space-grotesk">
          <span className="bg-gradient-neon bg-clip-text text-transparent">Find teammates</span> for
          <span className="bg-gradient-midnight bg-clip-text text-transparent">
            {' '}
            your CS projects
          </span>
        </h1>

        <p className="text-xl text-midnight-600 text-center max-w-2xl mb-10 leading-relaxed">
          Project Board connects computer science students with peers who want to further their
          skills by building projects, and provide them with valuable teamwork opportunities.
        </p>

        <div className="flex space-x-6 mb-16">
          <Link to="/projects">
            <Button
              variant="neon"
              size="lg"
              className="transform transition-all duration-300 hover:scale-105"
            >
              Browse Projects
            </Button>
          </Link>
          <Link to="/projects/new">
            <Button
              variant="dark"
              size="lg"
              className="transform transition-all duration-300 hover:scale-105"
            >
              Create Project
            </Button>
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
          <FeatureCard
            title="Find the right skills"
            description="Filter projects by skills you're looking for or add your skills to projects you create."
            icon={<SkillsIcon />}
          />
          <FeatureCard
            title="Connect with peers"
            description="Build your network with fellow CS students who share your interests."
            icon={<ConnectIcon />}
          />
          <FeatureCard
            title="Build your portfolio"
            description="Collaborate on real projects to enhance your resume and GitHub profile."
            icon={<PortfolioIcon />}
          />
        </div>
      </div>
    </div>
  );
};

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon }) => {
  return (
    <div className="bg-white rounded-2xl shadow-card p-6 border border-gray-100 group hover:shadow-hover transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden">
      {/* Decorative element */}
      <div className="absolute -right-4 -top-4 w-12 h-12 bg-neon-100 rounded-full transition-transform group-hover:scale-150 duration-500"></div>

      <div className="relative z-10">
        {/* Icon */}
        <div className="inline-flex items-center justify-center mb-4 text-neon-500">{icon}</div>

        {/* Title with dot accent */}
        <div className="flex items-center mb-2">
          <span className="inline-block w-2 h-2 rounded-full bg-neon-400 mr-2"></span>
          <h3 className="text-lg font-medium text-midnight-800">{title}</h3>
        </div>

        <p className="text-midnight-600">{description}</p>
      </div>
    </div>
  );
};

// Simple SVG icons for the feature cards
const SkillsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-8"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
    />
  </svg>
);

const ConnectIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-8"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
);

const PortfolioIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-8"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

export default Home;
