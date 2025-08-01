import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentTrack, setCurrentTrack] = useState('rain');
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const tracks = [
    { id: 'rain', name: 'Rain', emoji: '🌧️' },
    { id: 'nature', name: 'Nature', emoji: '🌿' },
    { id: 'cafe', name: 'Café', emoji: '☕' },
    { id: 'lofi', name: 'Lo-Fi', emoji: '🎵' },
  ];

  // Load new track source
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = `/sounds/${currentTrack}.mp3`;
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      }
    }
  }, [currentTrack]);

  // Play/pause logic
  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play().catch(console.error);
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  // Volume and mute
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const toggleMute = () => setIsMuted(!isMuted);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (newVolume > 0) setIsMuted(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl"
    >
      <h2 className="text-xl font-bold text-white mb-4">Focus Sounds</h2>

      {/* Track Selection */}
      <div className="grid grid-cols-2 gap-2 mb-6">
        {tracks.map(track => (
          <button
            key={track.id}
            onClick={() => setCurrentTrack(track.id)}
            className={`p-3 rounded-xl text-sm font-medium transition-all duration-200 ${
              currentTrack === track.id
                ? 'bg-white/20 text-white shadow-lg'
                : 'bg-white/5 text-white/70 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <span className="text-lg">{track.emoji}</span>
              <span>{track.name}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-4 mb-4">
        <button
          onClick={togglePlay}
          className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-200"
        >
          {isPlaying ? (
            <Pause size={20} className="text-white" />
          ) : (
            <Play size={20} className="text-white ml-1" />
          )}
        </button>

        <button
          onClick={toggleMute}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200"
        >
          {isMuted || volume === 0 ? (
            <VolumeX size={18} className="text-white" />
          ) : (
            <Volume2 size={18} className="text-white" />
          )}
        </button>

        <div className="flex-1 flex items-center space-x-2">
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="flex-1 appearance-none bg-white/10 rounded-full h-2 outline-none slider"
          />
          <span className="text-white/70 text-sm w-8">
            {Math.round((isMuted ? 0 : volume) * 100)}%
          </span>
        </div>
      </div>

      {/* Current Track Info */}
      <div className="text-center">
        <div className="text-white/70 text-sm mb-1">Now Playing</div>
        <div className="text-white font-medium">
          {tracks.find(t => t.id === currentTrack)?.emoji}{' '}
          {tracks.find(t => t.id === currentTrack)?.name}
        </div>
        {isPlaying && (
          <div className="flex justify-center mt-2">
            <div className="flex space-x-1">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-white/60 rounded-full animate-pulse"
                  style={{
                    height: `${Math.random() * 16 + 8}px`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Audio Element */}
      <audio ref={audioRef} loop />
    </motion.div>
  );
}