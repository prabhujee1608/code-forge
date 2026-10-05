import React, { useState, useEffect } from 'react';
import * as taskService from '../services/taskService';
import { useToast } from '../hooks/useToast';
import { CheckSquare, Plus, Trash2, CheckCircle2, Circle } from 'lucide-react';

export const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Coding');

  const toast = useToast();

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await taskService.getTasks();
      setTasks(data);
    } catch (err) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      await taskService.createTask({ title: newTitle, category: newCategory });
      toast.success('Task added!');
      setNewTitle('');
      fetchTasks();
    } catch (err) {
      toast.error('Failed to add task');
    }
  };

  const handleToggleTask = async (task) => {
    try {
      await taskService.updateTask(task._id, { completed: !task.completed });
      fetchTasks();
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await taskService.deleteTask(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      toast.success('Task deleted');
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Daily Preparation Plan</h1>
        <p className="text-xs text-slate-400 mt-1">
          Organize your daily coding goals, interview study items & project tasks
        </p>
      </div>

      {/* Add Task Form */}
      <form onSubmit={handleAddTask} className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="e.g. Solve 3 Binary Search Tree problems..."
          className="grow px-4 py-2.5 rounded-xl glass-input text-xs sm:text-sm"
        />

        <select
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="px-3 py-2.5 rounded-xl glass-input text-xs bg-slate-900"
        >
          <option value="Coding">Coding</option>
          <option value="Interview">Interview</option>
          <option value="Aptitude">Aptitude</option>
          <option value="Project">Project</option>
          <option value="General">General</option>
        </select>

        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Task
        </button>
      </form>

      {/* Task Checklist */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <div className="w-8 h-8 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-400">Loading daily tasks...</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-3xl border border-slate-800">
          <CheckSquare className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No Tasks Scheduled</h3>
          <p className="text-xs text-slate-400 mt-1">
            Add tasks above to organize your daily placement preparation plan.
          </p>
        </div>
      ) : (
        <div className="glass-panel rounded-3xl border border-slate-800 divide-y divide-slate-800">
          {tasks.map((t) => (
            <div
              key={t._id}
              className="p-4 flex items-center justify-between gap-3 hover:bg-slate-900/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <button onClick={() => handleToggleTask(t)}>
                  {t.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-600 hover:text-cyan-400 shrink-0 transition-colors" />
                  )}
                </button>
                <span className={`text-xs font-semibold ${t.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                  {t.title}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-full bg-slate-900 text-slate-400 text-[10px] font-mono border border-slate-800">
                  {t.category}
                </span>
                <button
                  onClick={() => handleDeleteTask(t._id)}
                  className="p-1 rounded text-slate-500 hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
