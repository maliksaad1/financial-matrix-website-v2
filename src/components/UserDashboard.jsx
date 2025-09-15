import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteWhatsapp, setInviteWhatsapp] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);

        if (user) {
          // Fetch user profile
          const { data: profileData, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('email', user.email)
            .single();

          if (profileError) {
            setError(profileError.message);
          } else {
            setProfile(profileData);
          }

          // Fetch user downloads
          const { data: downloadsData, error: downloadsError } = await supabase
            .from('downloads')
            .select(`
              id,
              downloaded_at,
              bots (title, description, file_url)
            `)
            .eq('user_id', user.id);

          if (downloadsError) {
            setError(downloadsError.message);
          } else {
            setDownloads(downloadsData);
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleInvite = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!profile || !profile.referral_code) {
      setMessage('Error: Referral code not found.');
      return;
    }

    // Logic to send invitation (e.g., via email or WhatsApp link)
    // This would typically involve a backend function or a direct mailto/WhatsApp link
    const referralLink = `${window.location.origin}/auth?referral=${profile.referral_code}`;

    if (inviteEmail) {
      // In a real application, you would send an email here.
      // For now, we'll just log the link.
      console.log(`Sending email invite to ${inviteEmail} with link: ${referralLink}`);
      setMessage(`Email invite simulated for ${inviteEmail}. Link: ${referralLink}`);
      setInviteEmail('');
    } else if (inviteWhatsapp) {
      // For WhatsApp, you can generate a direct link
      const whatsappLink = `https://wa.me/?text=Join Financial Matrix using my referral code: ${profile.referral_code} - ${referralLink}`;
      window.open(whatsappLink, '_blank');
      setMessage(`WhatsApp invite link generated for ${inviteWhatsapp}.`);
      setInviteWhatsapp('');
    } else {
      setMessage('Please enter an email or WhatsApp number to invite.');
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-destructive">Error: {error}</div>;
  }

  if (!user) {
    return <div className="text-center py-10">Please log in to view your dashboard.</div>;
  }

  return (
    <section className="container mx-auto px-4 py-8">
      <h2 className="text-4xl font-bold text-center text-primary mb-8">User Dashboard</h2>
      <div className="bg-card p-6 rounded-lg shadow-lg border border-border mb-8">
        <h3 className="text-2xl font-semibold text-primary mb-4">Welcome, {profile?.name || user.email}!</h3>
        <p className="text-foreground mb-2"><strong>Email:</strong> {user.email}</p>
        <p className="text-foreground mb-2"><strong>Referral Code:</strong> {profile?.referral_code || 'N/A'}</p>
        <p className="text-foreground mb-2"><strong>Referral Count:</strong> {profile?.referral_count || 0}</p>
        <p className="text-foreground mb-4">
          <strong>Your Referral Link:</strong>
          <span className="ml-2 text-primary cursor-pointer" onClick={() => navigator.clipboard.writeText(`${window.location.origin}/auth?referral=${profile?.referral_code}`)}>
            {`${window.location.origin}/auth?referral=${profile?.referral_code}`}
            <span className="ml-1 text-sm text-muted-foreground">(Click to copy)</span>
          </span>
        </p>

        <h4 className="text-xl font-semibold text-primary mb-3">Invite Friends</h4>
        <form onSubmit={handleInvite} className="space-y-4">
          <div>
            <label htmlFor="inviteEmail" className="block text-muted-foreground text-sm font-bold mb-2">Invite by Email:</label>
            <input
              type="email"
              id="inviteEmail"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-foreground leading-tight focus:outline-none focus:shadow-outline bg-input border-border"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="friend@example.com"
            />
          </div>
          <div>
            <label htmlFor="inviteWhatsapp" className="block text-muted-foreground text-sm font-bold mb-2">Invite by WhatsApp (number):</label>
            <input
              type="text"
              id="inviteWhatsapp"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-foreground leading-tight focus:outline-none focus:shadow-outline bg-input border-border"
              value={inviteWhatsapp}
              onChange={(e) => setInviteWhatsapp(e.target.value)}
              placeholder="+1234567890"
            />
          </div>
          <button
            type="submit"
            className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full transition-colors"
          >
            Send Invite
          </button>
        </form>
        {message && <p className="mt-4 text-center text-accent">{message}</p>}
      </div>

      <div className="bg-card p-6 rounded-lg shadow-lg border border-border">
        <h3 className="text-2xl font-semibold text-primary mb-4">Your Downloaded Bots</h3>
        {downloads.length === 0 ? (
          <p className="text-muted-foreground">You haven't downloaded any bots yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {downloads.map((download) => (
              <div key={download.id} className="bg-secondary p-4 rounded-lg border border-border">
                <h4 className="text-xl font-semibold text-primary mb-2">{download.bots.title}</h4>
                <p className="text-muted-foreground mb-2">{download.bots.description}</p>
                <p className="text-sm text-muted-foreground">Downloaded on: {new Date(download.downloaded_at).toLocaleDateString()}</p>
                <a
                  href={download.bots.file_url}
                  download
                  className="block mt-3 w-full text-center bg-primary text-primary-foreground hover:bg-primary/90 py-2 px-4 rounded-md font-semibold transition-colors"
                >
                  Download Again
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default UserDashboard;

