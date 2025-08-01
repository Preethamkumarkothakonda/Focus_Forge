import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { quotes } from '../utils/quotes';
import { Quote } from '../types';

export function QuoteCarousel() {
  const [currentQuote, setCurrentQuote] = useState<Quote>(quotes[0]);
  const [isAnimating, setIsAnimating] = useState(false);

  const getRandomQuote = () => {
    let newQuote;
    do {
      newQuote = quotes[Math.floor(Math.random() * quotes.length)];
    } while (newQuote.text === currentQuote.text && quotes.length > 1);
    return newQuote;
  };

  const nextQuote = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentQuote(getRandomQuote());
    setTimeout(() => setIsAnimating(false), 600);
  };

  useEffect(() => {
    const interval = setInterval(nextQuote, 30000); // Change quote every 30 seconds
    return () => clearInterval(interval);
  }, [currentQuote]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl text-center"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Daily Inspiration</h2>
        <button
          onClick={nextQuote}
          disabled={isAnimating}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200 disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={`text-white transition-transform duration-300 ${
              isAnimating ? 'animate-spin' : ''
            }`}
          />
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuote.text}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="min-h-[120px] flex flex-col justify-center"
        >
          <blockquote className="text-white text-lg italic leading-relaxed mb-4">
            "{currentQuote.text}"
          </blockquote>
          <cite className="text-white/70 text-sm font-medium">
            — {currentQuote.author}
          </cite>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}