import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-card text-card-foreground p-4 text-center shadow-md mt-8">
      <div className="container mx-auto">
        <p>&copy; {new Date().getFullYear()} Financial Matrix. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

