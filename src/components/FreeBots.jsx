import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const FreeBots = () => {
  const [bots, setBots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFreeBots = async () => {
      const { data, error } = await supabase
        .from('bots')
        .select('*')
        .eq('referral_required', false);

      if (error) {
        setError(error.message);
      } else {
        setBots(data);
      }
      setLoading(false);
    };

    fetchFreeBots();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading free bots...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-destructive">Error: {error}</div>;
  }

  return (
    <section className="container mx-auto px-4 py-8">
      <h2 className="text-4xl font-bold text-center text-primary mb-8">Free AI Bots</h2>
      <p className="text-center text-lg text-foreground mb-12">
        Explore our selection of powerful AI trading bots available for free. No referrals needed!
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
              <a
                href={bot.file_url}
                download
                className="block w-full text-center bg-accent text-accent-foreground hover:bg-accent/90 py-2 px-4 rounded-md font-semibold transition-colors"
              >
                Download Bot
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FreeBots;

