import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const Navbar = () => {
  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSessionAndRole = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);

      if (session) {
        const { data: profileData, error: profileError } = await supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error('Error fetching user role:', profileError.message);
        } else if (profileData && profileData.role === 'admin') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      }
    };

    fetchSessionAndRole();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        const fetchRoleOnAuthChange = async () => {
          const { data: profileData, error: profileError } = await supabase
            .from('users')
            .select('role')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            console.error('Error fetching user role on auth change:', profileError.message);
          } else if (profileData && profileData.role === 'admin') {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        };
        fetchRoleOnAuthChange();
      } else {
        setIsAdmin(false);
      }
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
          {isAdmin && (
            <Link to="/admin" className="hover:text-primary transition-colors">
              Admin
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

