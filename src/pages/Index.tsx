import React, { useState, useEffect } from 'react';
import { TaskForm } from '../components/TaskForm';
import { TaskItem } from '../components/TaskItem';
import { SearchFilter } from '../components/SearchFilter';
import { useToast } from "@/hooks/use-toast";

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

const TaskManager = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const { toast } = useToast();

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('taskManager_tasks');
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks).map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt),
        }));
        setTasks(parsedTasks);
      } catch (error) {
        console.error('Error loading tasks from localStorage:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load saved tasks.",
        });
      }
    }
  }, [toast]);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('taskManager_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTasks(prev => [...prev, newTask]);
    toast({
      title: "Success",
      description: "Task created successfully!",
    });
  };

  const updateTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingTask) return;
    
    setTasks(prev => prev.map(task =>
      task.id === editingTask.id
        ? { ...task, ...taskData, updatedAt: new Date() }
        : task
    ));
    setEditingTask(null);
    toast({
      title: "Success",
      description: "Task updated successfully!",
    });
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
    toast({
      title: "Success", 
      description: "Task deleted successfully!",
    });
  };

  const toggleTaskStatus = (id: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === id) {
        const statusOrder: Task['status'][] = ['todo', 'in-progress', 'completed'];
        const currentIndex = statusOrder.indexOf(task.status);
        const nextIndex = (currentIndex + 1) % statusOrder.length;
        return {
          ...task,
          status: statusOrder[nextIndex],
          updatedAt: new Date(),
        };
      }
      return task;
    }));
  };

  // Filter and search tasks
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-card shadow-soft border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-foreground">Task Manager</h1>
          <p className="text-muted-foreground mt-2">Organize your tasks efficiently</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Task Form */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg p-6 shadow-soft border border-border">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                {editingTask ? 'Edit Task' : 'Add New Task'}
              </h2>
              <TaskForm
                task={editingTask}
                onSubmit={editingTask ? updateTask : addTask}
                onCancel={() => setEditingTask(null)}
              />
            </div>
          </div>

          {/* Tasks List */}
          <div className="lg:col-span-2">
            {/* Search and Filter */}
            <SearchFilter
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              filterStatus={filterStatus}
              onStatusChange={setFilterStatus}
              filterPriority={filterPriority}
              onPriorityChange={setFilterPriority}
            />

            {/* Tasks Display */}
            <div className="space-y-4 mt-6">
              {filteredTasks.length === 0 ? (
                <div className="bg-card rounded-lg p-8 text-center border border-border">
                  <div className="text-muted-foreground">
                    {tasks.length === 0 
                      ? "No tasks yet. Create your first task to get started!" 
                      : "No tasks match your current filters."}
                  </div>
                </div>
              ) : (
                filteredTasks.map((task, index) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    index={index}
                    onEdit={setEditingTask}
                    onDelete={deleteTask}
                    onToggleStatus={toggleTaskStatus}
                  />
                ))
              )}
            </div>

            {/* Statistics */}
            {tasks.length > 0 && (
              <div className="mt-8 bg-card rounded-lg p-6 shadow-soft border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">Statistics</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">
                      {tasks.filter(t => t.status === 'todo').length}
                    </div>
                    <div className="text-sm text-muted-foreground">To Do</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-warning">
                      {tasks.filter(t => t.status === 'in-progress').length}
                    </div>
                    <div className="text-sm text-muted-foreground">In Progress</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-success">
                      {tasks.filter(t => t.status === 'completed').length}
                    </div>
                    <div className="text-sm text-muted-foreground">Completed</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-muted-foreground">
          <p>&copy;My Task Manager</p>
        </div>
      </footer>
    </div>
  );
};

export default TaskManager;