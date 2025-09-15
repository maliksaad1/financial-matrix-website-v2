import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-background to-card text-foreground py-20 md:py-32 lg:py-48 overflow-hidden">
      <div className="container mx-auto px-4 text-center relative z-10">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 animate-fade-in-up">
          Unlock Your Financial Potential with <span className="text-primary">AI Bots</span>
        </h1>
        <p className="text-lg md:text-xl lg:text-2xl mb-10 max-w-3xl mx-auto animate-fade-in-up animation-delay-200">
          Automate your trading, optimize investments, and achieve financial freedom with our cutting-edge AI-powered bots.
        </p>
        <div className="flex justify-center space-x-4 animate-fade-in-up animation-delay-400">
          <Link
            to="/free-bots"
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 rounded-full text-lg font-semibold transition-all duration-300 shadow-lg transform hover:scale-105"
          >
            Explore Free Bots
          </Link>
          <Link
            to="/auth"
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-8 py-3 rounded-full text-lg font-semibold transition-all duration-300 shadow-lg transform hover:scale-105"
          >
            Get Started
          </Link>
        </div>
      </div>

      {/* Background animated elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-accent rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-1000"></div>
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-primary rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-1500"></div>
        <div className="absolute bottom-1/4 left-1/3 w-56 h-56 bg-secondary rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>
    </section>
  );
};

export default Hero;

