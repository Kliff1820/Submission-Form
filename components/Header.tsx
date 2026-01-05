
import React from 'react';
import { Role } from '../types';
import ClipboardIcon from './icons/ClipboardIcon';
import WrenchIcon from './icons/WrenchIcon';
import DashboardIcon from './icons/DashboardIcon';

interface HeaderProps {
  activeRole: Role;
  setActiveRole: (role: Role) => void;
}

const Header: React.FC<HeaderProps> = ({ activeRole, setActiveRole }) => {
  const roles = [
    { name: Role.Cleaner, icon: <ClipboardIcon className="h-5 w-5 mr-2" /> },
    { name: Role.Maintenance, icon: <WrenchIcon className="h-5 w-5 mr-2" /> },
    { name: Role.Admin, icon: <DashboardIcon className="h-5 w-5 mr-2" /> },
  ];

  return (
    <header className="bg-brand-dark shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between py-4">
          <div className="flex items-center mb-4 sm:mb-0">
             <svg className="w-10 h-10 text-brand-blue" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"></path></svg>
            <h1 className="text-2xl font-bold text-white ml-2">STR Property Manager</h1>
          </div>
          <nav className="flex space-x-2 sm:space-x-4 p-1 bg-gray-800 rounded-lg">
            {roles.map((role) => (
              <button
                key={role.name}
                onClick={() => setActiveRole(role.name)}
                className={`flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-brand-blue ${
                  activeRole === role.name
                    ? 'bg-brand-blue text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {role.icon}
                {role.name}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
