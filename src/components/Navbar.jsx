import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-card text-card-foreground p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-primary">
          Financial Matrix
        </Link>
        <div className="space-x-4">
          <Link to="/free-bots" className="hover:text-primary transition-colors">
            Free Bots
          </Link>
          <Link to="/unlockable-bots" className="hover:text-primary transition-colors">
            Unlockable Bots
          </Link>
          <Link to="/dashboard" className="hover:text-primary transition-colors">
            Dashboard
          </Link>
          <Link to="/auth" className="hover:text-primary transition-colors">
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

