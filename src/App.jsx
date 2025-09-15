import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './components/Hero';
import FreeBots from './components/FreeBots';
import UnlockableBots from './components/UnlockableBots';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import Auth from './components/Auth';

function App() {
  return (
    <BrowserRouter basename="/financial-matrix-website-v2/">
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/free-bots" element={<FreeBots />} />
            <Route path="/unlockable-bots" element={<UnlockableBots />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
