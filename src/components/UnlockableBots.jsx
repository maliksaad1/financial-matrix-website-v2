import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const UnlockableBots = () => {
  const [bots, setBots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUnlockableBots = async () => {
      const { data, error } = await supabase
        .from('bots')
        .select('*')
        .eq('referral_required', true);

      if (error) {
        setError(error.message);
      } else {
        setBots(data);
      }
      setLoading(false);
    };

    fetchUnlockableBots();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading unlockable bots...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-destructive">Error: {error}</div>;
  }

  return (
    <section className="container mx-auto px-4 py-8">
      <h2 className="text-4xl font-bold text-center text-primary mb-8">Unlockable AI Bots</h2>
      <p className="text-center text-lg text-foreground mb-12">
        Gain access to exclusive, high-performance AI trading bots by referring friends to Financial Matrix.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {bots.map((bot) => (
          <div key={bot.id} className="bg-card p-6 rounded-lg shadow-lg border border-border flex flex-col">
            <h3 className="text-2xl font-semibold text-primary mb-3">{bot.title}</h3>
            <p className="text-muted-foreground mb-4 flex-grow">{bot.description}</p>
            <div className="mt-auto">
              {bot.backtest_image_url && (
                <img src={bot.backtest_image_url} alt={`${bot.title} backtest`} className="w-full h-48 object-cover rounded-md mb-4" />
              )}
              <button
                className="block w-full text-center bg-secondary text-secondary-foreground hover:bg-secondary/90 py-2 px-4 rounded-md font-semibold transition-colors"
                disabled
              >
                Refer to Unlock
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default UnlockableBots;

