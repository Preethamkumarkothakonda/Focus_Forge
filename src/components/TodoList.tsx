import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check, X, Edit2 } from 'lucide-react';
import { Task } from '../types';
import { storage } from '../utils/localStorage';
import confetti from 'canvas-confetti';

interface TodoListProps {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
}

export function TodoList({ tasks, setTasks }: TodoListProps) {
  const [newTask, setNewTask] = useState('');
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const addTask = () => {
    if (newTask.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        text: newTask.trim(),
        completed: false,
        createdAt: new Date(),
      };
      const updatedTasks = [...tasks, task];
      setTasks(updatedTasks);
      storage.setTasks(updatedTasks);
      setNewTask('');
    }
  };

  const toggleTask = (id: string) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === id) {
        const completed = !task.completed;
        if (completed) {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 }
          });
        }
        return { ...task, completed };
      }
      return task;
    });
    setTasks(updatedTasks);
    storage.setTasks(updatedTasks);
  };

  const deleteTask = (id: string) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
    storage.setTasks(updatedTasks);
  };

  const startEdit = (task: Task) => {
    setEditingTask(task.id);
    setEditText(task.text);
  };

  const saveEdit = (id: string) => {
    if (editText.trim()) {
      const updatedTasks = tasks.map(task =>
        task.id === id ? { ...task, text: editText.trim() } : task
      );
      setTasks(updatedTasks);
      storage.setTasks(updatedTasks);
    }
    setEditingTask(null);
    setEditText('');
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Tasks</h2>
        <div className="text-white/70 text-sm">
          {completedTasks}/{totalTasks} completed
        </div>
      </div>

      {/* Add Task */}
      <div className="flex space-x-2 mb-6">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTask()}
          placeholder="Add a new task..."
          className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          onClick={addTask}
          className="px-4 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl transition-colors duration-200"
        >
          <Plus size={20} className="text-white" />
        </button>
      </div>

      {/* Progress Bar */}
      {totalTasks > 0 && (
        <div className="mb-6">
          <div className="w-full bg-white/10 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-500 to-green-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(completedTasks / totalTasks) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Task List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {tasks.map(task => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`flex items-center space-x-3 p-4 rounded-xl transition-all duration-200 ${
                task.completed
                  ? 'bg-green-500/20 border border-green-500/30'
                  : 'bg-white/5 border border-white/10 hover:bg-white/10'
              }`}
            >
              <button
                onClick={() => toggleTask(task.id)}
                className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                  task.completed
                    ? 'bg-green-500 border-green-500'
                    : 'border-white/30 hover:border-white/50'
                }`}
              >
                {task.completed && <Check size={16} className="text-white" />}
              </button>

              {editingTask === task.id ? (
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && saveEdit(task.id)}
                  onBlur={() => saveEdit(task.id)}
                  className="flex-1 px-2 py-1 bg-white/10 border border-white/20 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  autoFocus
                />
              ) : (
                <span
                  className={`flex-1 ${
                    task.completed
                      ? 'line-through text-white/60'
                      : 'text-white'
                  }`}
                >
                  {task.text}
                </span>
              )}

              <div className="flex space-x-2">
                <button
                  onClick={() => startEdit(task)}
                  className="p-1 hover:bg-white/10 rounded transition-colors duration-200"
                >
                  <Edit2 size={16} className="text-white/60" />
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="p-1 hover:bg-white/10 rounded transition-colors duration-200"
                >
                  <X size={16} className="text-white/60" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {tasks.length === 0 && (
        <div className="text-center py-12">
          <div className="text-white/50 text-lg">No tasks yet</div>
          <div className="text-white/30 text-sm mt-2">
            Add your first task to get started!
          </div>
        </div>
      )}
    </motion.div>
  );
}