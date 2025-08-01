import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { PomodoroStats } from '../types';

interface FocusTrackerProps {
  stats: PomodoroStats[];
}

export function FocusTracker({ stats }: FocusTrackerProps) {
  const chartData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => {
      const dayStats = stats.find(s => s.date === date);
      const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
      
      return {
        date: dayName,
        completed: dayStats?.completed || 0,
        workMinutes: dayStats?.workMinutes || 0,
      };
    });
  }, [stats]);

  const todayStats = stats.find(s => s.date === new Date().toISOString().split('T')[0]);
  const totalToday = todayStats?.completed || 0;
  const totalThisWeek = stats
    .filter(stat => {
      const statDate = new Date(stat.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return statDate >= weekAgo;
    })
    .reduce((sum, stat) => sum + stat.completed, 0);
  const avgThisWeek = Math.round(totalThisWeek / 7);
  const totalWorkMinutesToday = todayStats?.workMinutes || 0;
  const totalWorkHoursToday = Math.round(totalWorkMinutesToday / 60 * 10) / 10;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl"
    >
      <h2 className="text-2xl font-bold text-white mb-6">Focus Tracker</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white/10 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-white">{totalToday}</div>
          <div className="text-white/70 text-sm">Pomodoros Today</div>
        </div>
        <div className="bg-white/10 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-white">{totalThisWeek}</div>
          <div className="text-white/70 text-sm">This Week</div>
        </div>
        <div className="bg-white/10 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-white">{avgThisWeek}</div>
          <div className="text-white/70 text-sm">Daily Average</div>
        </div>
        <div className="bg-white/10 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-white">{totalWorkHoursToday}h</div>
          <div className="text-white/70 text-sm">Focus Time Today</div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white/5 rounded-xl p-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'rgba(255, 255, 255, 0.7)', fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'rgba(255, 255, 255, 0.7)', fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                backdropFilter: 'blur(10px)',
                color: 'white',
              }}
            />
            <Bar
              dataKey="completed"
              fill="url(#gradient)"
              radius={[4, 4, 0, 0]}
            />
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7F5AF0" />
                <stop offset="100%" stopColor="#2CB67D" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Motivational Message */}
      <div className="mt-6 text-center">
        {totalToday >= 12 && (
          <div className="text-green-400 font-semibold">
            🎉 Exceptional focus today! You're on fire! 🔥
          </div>
        )}
        {totalToday >= 8 && totalToday < 12 && (
          <div className="text-green-400 font-semibold">
            🌟 Outstanding productivity! You're crushing it!
          </div>
        )}
        {totalToday >= 4 && totalToday < 8 && (
          <div className="text-yellow-400 font-semibold">
            ⭐ Great progress! You're in the zone!
          </div>
        )}
        {totalToday > 0 && totalToday < 4 && (
          <div className="text-blue-400 font-semibold">
            🚀 Good start! Keep building momentum!
          </div>
        )}
        {totalToday === 0 && (
          <div className="text-white/70">
            🚀 Ready to start your focus journey today?
          </div>
        )}
      </div>
    </motion.div>
  );
}