import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [bots, setBots] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [newBot, setNewBot] = useState({
    title: '',
    description: '',
    type: '',
    referral_required: false,
    file_url: '',
    backtest_image_url: '',
  });
  const [editingBot, setEditingBot] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth'); // Redirect to login if not authenticated
        return;
      }

      // Fetch user profile to check role
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Error fetching user profile:', profileError.message);
        setError('Failed to fetch user role.');
        setLoading(false);
        return;
      }

      if (profileData && profileData.role === 'admin') {
        setIsAdmin(true);
        fetchData(); // Fetch admin data only if user is admin
      } else {
        setIsAdmin(false);
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [navigate]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch bots
      const { data: botsData, error: botsError } = await supabase
        .from('bots')
        .select('*');
      if (botsError) throw botsError;
      setBots(botsData);

      // Fetch users
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*');
      if (usersError) throw usersError;
      setUsers(usersData);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewBot((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAddBot = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const { data, error } = await supabase
        .from('bots')
        .insert([newBot])
        .select();

      if (error) throw error;
      setBots((prev) => [...prev, data[0]]);
      setNewBot({
        title: '',
        description: '',
        type: '',
        referral_required: false,
        file_url: '',
        backtest_image_url: '',
      });
      setMessage('Bot added successfully!');
    } catch (err) {
      setMessage(`Error adding bot: ${err.message}`);
    }
  };

  const handleEditBot = (bot) => {
    setEditingBot(bot);
    setNewBot(bot); // Populate form with bot data for editing
  };

  const handleUpdateBot = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!editingBot) return;

    try {
      const { data, error } = await supabase
        .from('bots')
        .update(newBot)
        .eq('id', editingBot.id)
        .select();

      if (error) throw error;
      setBots((prev) => prev.map((bot) => (bot.id === editingBot.id ? data[0] : bot)));
      setEditingBot(null);
      setNewBot({
        title: '',
        description: '',
        type: '',
        referral_required: false,
        file_url: '',
        backtest_image_url: '',
      });
      setMessage('Bot updated successfully!');
    } catch (err) {
      setMessage(`Error updating bot: ${err.message}`);
    }
  };

  const handleDeleteBot = async (botId) => {
    setMessage('');
    if (!window.confirm('Are you sure you want to delete this bot?')) return;

    try {
      const { error } = await supabase
        .from('bots')
        .delete()
        .eq('id', botId);

      if (error) throw error;
      setBots((prev) => prev.filter((bot) => bot.id !== botId));
      setMessage('Bot deleted successfully!');
    } catch (err) {
      setMessage(`Error deleting bot: ${err.message}`);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading admin dashboard...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-destructive">Error: {error}</div>;
  }

  if (!isAdmin) {
    return <div className="text-center py-10 text-xl text-destructive">Access Denied: You do not have administrative privileges.</div>;
  }

  return (
    <section className="container mx-auto px-4 py-8">
      <h2 className="text-4xl font-bold text-center text-primary mb-8">Admin Dashboard</h2>

      {message && (
        <p className={`mt-4 text-center ${message.includes('Error') ? 'text-destructive' : 'text-accent'}`}>
          {message}
        </p>
      )}

      {/* Bot Management */}
      <div className="bg-card p-6 rounded-lg shadow-lg border border-border mb-8">
        <h3 className="text-2xl font-semibold text-primary mb-4">Bot Management</h3>
        <form onSubmit={editingBot ? handleUpdateBot : handleAddBot} className="space-y-4 mb-8">
          <div>
            <label htmlFor="title" className="block text-muted-foreground text-sm font-bold mb-2">Title:</label>
            <input
              type="text"
              id="title"
              name="title"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-foreground leading-tight focus:outline-none focus:shadow-outline bg-input border-border"
              value={newBot.title}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-muted-foreground text-sm font-bold mb-2">Description:</label>
            <textarea
              id="description"
              name="description"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-foreground leading-tight focus:outline-none focus:shadow-outline bg-input border-border"
              value={newBot.description}
              onChange={handleInputChange}
              required
            ></textarea>
          </div>
          <div>
            <label htmlFor="type" className="block text-muted-foreground text-sm font-bold mb-2">Type:</label>
            <input
              type="text"
              id="type"
              name="type"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-foreground leading-tight focus:outline-none focus:shadow-outline bg-input border-border"
              value={newBot.type}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="referral_required"
              name="referral_required"
              className="mr-2 leading-tight"
              checked={newBot.referral_required}
              onChange={handleInputChange}
            />
            <label htmlFor="referral_required" className="text-muted-foreground text-sm font-bold">Referral Required</label>
          </div>
          <div>
            <label htmlFor="file_url" className="block text-muted-foreground text-sm font-bold mb-2">File URL:</label>
            <input
              type="text"
              id="file_url"
              name="file_url"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-foreground leading-tight focus:outline-none focus:shadow-outline bg-input border-border"
              value={newBot.file_url}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="backtest_image_url" className="block text-muted-foreground text-sm font-bold mb-2">Backtest Image URL:</label>
            <input
              type="text"
              id="backtest_image_url"
              name="backtest_image_url"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-foreground leading-tight focus:outline-none focus:shadow-outline bg-input border-border"
              value={newBot.backtest_image_url}
              onChange={handleInputChange}
            />
          </div>
          <button
            type="submit"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full transition-colors"
          >
            {editingBot ? 'Update Bot' : 'Add Bot'}
          </button>
          {editingBot && (
            <button
              type="button"
              onClick={() => {
                setEditingBot(null);
                setNewBot({
                  title: '',
                  description: '',
                  type: '',
                  referral_required: false,
                  file_url: '',
                  backtest_image_url: '',
                });
              }}
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full transition-colors mt-2"
            >
              Cancel Edit
            </button>
          )}
        </form>

        <h4 className="text-xl font-semibold text-primary mb-3">Existing Bots</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bots.map((bot) => (
            <div key={bot.id} className="bg-secondary p-4 rounded-lg border border-border flex flex-col">
              <h5 className="text-lg font-semibold text-primary mb-1">{bot.title}</h5>
              <p className="text-muted-foreground text-sm mb-2 flex-grow">{bot.description}</p>
              <p className="text-xs text-muted-foreground">Type: {bot.type}</p>
              <p className="text-xs text-muted-foreground">Referral Required: {bot.referral_required ? 'Yes' : 'No'}</p>
              <div className="flex space-x-2 mt-3">
                <button
                  onClick={() => handleEditBot(bot)}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground text-sm py-1 px-3 rounded-md transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteBot(bot.id)}
                  className="bg-destructive hover:bg-destructive/90 text-destructive-foreground text-sm py-1 px-3 rounded-md transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User Management */}
      <div className="bg-card p-6 rounded-lg shadow-lg border border-border">
        <h3 className="text-2xl font-semibold text-primary mb-4">User Management</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-secondary rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-primary text-primary-foreground">
                <th className="py-2 px-4 text-left">Name</th>
                <th className="py-2 px-4 text-left">Email</th>
                <th className="py-2 px-4 text-left">WhatsApp</th>
                <th className="py-2 px-4 text-left">Referral Code</th>
                <th className="py-2 px-4 text-left">Referral Count</th>
                <th className="py-2 px-4 text-left">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t border-border hover:bg-secondary/50">
                  <td className="py-2 px-4">{user.name || 'N/A'}</td>
                  <td className="py-2 px-4">{user.email}</td>
                  <td className="py-2 px-4">{user.whatsapp || 'N/A'}</td>
                  <td className="py-2 px-4">{user.referral_code || 'N/A'}</td>
                  <td className="py-2 px-4">{user.referral_count}</td>
                  <td className="py-2 px-4">{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default AdminDashboard;

