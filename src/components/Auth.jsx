import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/dashboard'); // Redirect to dashboard if already logged in
      }
    };
    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        navigate('/dashboard');
      } else {
        // Optionally redirect to login if session ends while on a protected route
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Logged in successfully!');
      // Redirection handled by onAuthStateChange listener
    }
    setLoading(false);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const urlParams = new URLSearchParams(window.location.search);
    const referrerCode = urlParams.get("referral");

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (!error && data.user) {
      const referralCode = data.user.id.substring(0, 8);
      const { error: profileError } = await supabase
        .from("users")
        .insert([{ id: data.user.id, email: data.user.email, referral_code: referralCode, referral_count: 0 }]);

      if (profileError) {
        console.error("Error creating user profile:", profileError.message);
        setMessage("Sign up successful, but failed to create profile. Please contact support.");
        setLoading(false);
        return;
      }

      // If there's a referrer, increment their referral count
      if (referrerCode) {
        const { data: referrerData, error: referrerError } = await supabase
          .from("users")
          .select("id, referral_count")
          .eq("referral_code", referrerCode)
          .single();

        if (referrerError) {
          console.error("Error finding referrer:", referrerError.message);
        } else if (referrerData) {
          const { error: updateError } = await supabase
            .from("users")
            .update({ referral_count: referrerData.referral_count + 1 })
            .eq("id", referrerData.id);

          if (updateError) {
            console.error("Error updating referrer count:", updateError.message);
          }
        }
      }
    }

    if (error) {
      setMessage(error.message);
    } else if (data.user && data.user.identities && data.user.identities.length === 0) {
      setMessage('Sign up successful! Please check your email to confirm your account.');
    } else {
      setMessage('Sign up successful! You are now logged in.');
      // Redirection handled by onAuthStateChange listener
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)] bg-background p-4">
      <div className="bg-card p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-primary mb-6">
          {isSignUp ? 'Sign Up' : 'Login'}
        </h2>
        <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-muted-foreground text-sm font-bold mb-2">
              Email:
            </label>
            <input
              type="email"
              id="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-foreground leading-tight focus:outline-none focus:shadow-outline bg-input border-border"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-muted-foreground text-sm font-bold mb-2">
              Password:
            </label>
            <input
              type="password"
              id="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-foreground leading-tight focus:outline-none focus:shadow-outline bg-input border-border"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full transition-colors"
            disabled={loading}
          >
            {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Login')}
          </button>
        </form>
        {message && (
          <p className={`mt-4 text-center ${message.includes('successfully') ? 'text-accent' : 'text-destructive'}`}>
            {message}
          </p>
        )}
        <p className="mt-6 text-center text-muted-foreground">
          {isSignUp ? 'Already have an account?' : 'Don\'t have an account?'}{' '}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-primary hover:underline focus:outline-none"
          >
            {isSignUp ? 'Login' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;

