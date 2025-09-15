import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const Navbar = () => {
  const [session, setSession] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error.message);
    } else {
      navigate('/auth'); // Redirect to login page after logout
    }
  };

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
          {session && (
            <Link to="/dashboard" className="hover:text-primary transition-colors">
              Dashboard
            </Link>
          )}
          {session ? (
            <button onClick={handleLogout} className="hover:text-primary transition-colors">
              Logout
            </button>
          ) : (
            <Link to="/auth" className="hover:text-primary transition-colors">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

