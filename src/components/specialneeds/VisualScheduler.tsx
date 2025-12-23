import React, { useState } from 'react';
import { motion, Reorder } from 'framer-motion';
import { 
  Calendar, Plus, Check, Clock, Trash2, 
  GripVertical, Edit2, Save 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface Task {
  id: string;
  title: string;
  time: string;
  completed: boolean;
  color: string;
}

const colorOptions = [
  'from-blue-400 to-cyan-500',
  'from-green-400 to-emerald-500',
  'from-purple-400 to-pink-500',
  'from-yellow-400 to-orange-500',
  'from-red-400 to-rose-500',
  'from-indigo-400 to-violet-500',
];

const defaultTasks: Task[] = [
  { id: '1', title: 'Morning Exercise', time: '8:00 AM', completed: true, color: colorOptions[0] },
  { id: '2', title: 'Reading Time', time: '9:30 AM', completed: true, color: colorOptions[1] },
  { id: '3', title: 'Math Practice', time: '11:00 AM', completed: false, color: colorOptions[2] },
  { id: '4', title: 'Lunch Break', time: '12:30 PM', completed: false, color: colorOptions[3] },
  { id: '5', title: 'Art Activity', time: '2:00 PM', completed: false, color: colorOptions[4] },
];

const VisualScheduler: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(defaultTasks);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskTime, setNewTaskTime] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const completedCount = tasks.filter(t => t.completed).length;
  const progressPercentage = (completedCount / tasks.length) * 100;

  const handleAddTask = () => {
    if (!newTaskTitle.trim() || !newTaskTime.trim()) return;
    
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      time: newTaskTime,
      completed: false,
      color: colorOptions[Math.floor(Math.random() * colorOptions.length)],
    };
    
    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
    setNewTaskTime('');
    setIsAddingTask(false);
  };

  const toggleComplete = (id: string) => {
    setTasks(tasks.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const startEdit = (task: Task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
  };

  const saveEdit = (id: string) => {
    setTasks(tasks.map(t => 
      t.id === id ? { ...t, title: editTitle } : t
    ));
    setEditingId(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-display font-bold text-foreground">
              Visual Schedule
            </h2>
            <p className="text-sm text-muted-foreground">
              Drag to reorder • Tap to complete
            </p>
          </div>
        </div>
        
        <Button onClick={() => setIsAddingTask(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Task
        </Button>
      </div>

      {/* Progress Bar */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">Today's Progress</span>
          <span className="text-sm text-primary font-bold">{completedCount}/{tasks.length} completed</span>
        </div>
        <div className="h-4 bg-secondary rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
          />
        </div>
      </Card>

      {/* Add Task Form */}
      {isAddingTask && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <Card className="p-4">
            <div className="flex gap-3">
              <Input
                placeholder="Task title"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="flex-1"
              />
              <Input
                placeholder="Time (e.g., 3:00 PM)"
                value={newTaskTime}
                onChange={(e) => setNewTaskTime(e.target.value)}
                className="w-32"
              />
              <Button onClick={handleAddTask}>Add</Button>
              <Button variant="outline" onClick={() => setIsAddingTask(false)}>Cancel</Button>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Tasks List */}
      <Reorder.Group 
        axis="y" 
        values={tasks} 
        onReorder={setTasks}
        className="space-y-3"
      >
        {tasks.map((task) => (
          <Reorder.Item
            key={task.id}
            value={task}
            className="cursor-grab active:cursor-grabbing"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative overflow-hidden rounded-2xl border transition-all ${
                task.completed 
                  ? 'bg-secondary/50 border-border' 
                  : 'bg-card border-border hover:border-primary/50'
              }`}
            >
              {/* Color Bar */}
              <div className={`absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b ${task.color}`} />
              
              <div className="p-4 pl-6 flex items-center gap-4">
                {/* Drag Handle */}
                <GripVertical className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                
                {/* Checkbox */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => toggleComplete(task.id)}
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                    task.completed 
                      ? 'bg-primary border-primary' 
                      : 'border-muted-foreground hover:border-primary'
                  }`}
                >
                  {task.completed && <Check className="w-5 h-5 text-primary-foreground" />}
                </motion.button>

                {/* Task Info */}
                <div className="flex-1 min-w-0">
                  {editingId === task.id ? (
                    <div className="flex items-center gap-2">
                      <Input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="h-8"
                        autoFocus
                      />
                      <Button size="sm" onClick={() => saveEdit(task.id)}>
                        <Save className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <h3 className={`font-semibold transition-all ${
                        task.completed ? 'text-muted-foreground line-through' : 'text-foreground'
                      }`}>
                        {task.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{task.time}</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => startEdit(task)}
                    className="p-2 hover:bg-secondary rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4 text-muted-foreground" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => deleteTask(task.id)}
                    className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </motion.button>
                </div>
              </div>

              {/* Completion Animation */}
              {task.completed && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  className="absolute inset-0 bg-primary/5 origin-left pointer-events-none"
                />
              )}
            </motion.div>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </motion.div>
  );
};

export default VisualScheduler;
