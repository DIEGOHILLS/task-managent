import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import type { Task } from '../pages/Index';

interface TaskFormProps {
  task?: Task | null;
  onSubmit: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel?: () => void;
}

interface FormData {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'completed';
  deadline?: Date;
}

interface FormErrors {
  title?: string;
  description?: string;
}

export const TaskForm: React.FC<TaskFormProps> = ({ task, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    priority: 'medium',
    status: 'todo',
    deadline: undefined,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const calendarRef = useRef<HTMLDivElement>(null);

  // Close calendar if clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setCalendarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        deadline: task.deadline ? new Date(task.deadline) : undefined,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        status: 'todo',
        deadline: undefined,
      });
    }
    setErrors({});
  }, [task]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    else if (formData.title.trim().length < 3) newErrors.title = 'Title must be at least 3 characters long';
    else if (formData.title.trim().length > 100) newErrors.title = 'Title must be less than 100 characters';

    if (!formData.description.trim()) newErrors.description = 'Description is required';
    else if (formData.description.trim().length < 10) newErrors.description = 'Description must be at least 10 characters long';
    else if (formData.description.trim().length > 500) newErrors.description = 'Description must be less than 500 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    onSubmit({
      title: formData.title.trim(),
      description: formData.description.trim(),
      priority: formData.priority,
      status: formData.status,
      deadline: formData.deadline,
    });

    if (!task) setFormData({ title: '', description: '', priority: 'medium', status: 'todo', deadline: undefined });
    setIsSubmitting(false);
  };

  const handleCancel = () => {
    setFormData({ title: '', description: '', priority: 'medium', status: 'todo', deadline: undefined });
    setErrors({});
    onCancel?.();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-destructive';
      case 'medium': return 'text-warning';
      case 'low': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-success';
      case 'in-progress': return 'text-warning';
      case 'todo': return 'text-primary';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Title Field */}
      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm font-medium text-foreground">Task Title *</Label>
        <Input
          id="title"
          type="text"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Enter task title..."
          className={`transition-all duration-300 transform hover:scale-[1.01] focus:scale-[1.02] ${errors.title ? 'border-destructive focus:ring-destructive animate-pulse' : 'focus:ring-primary focus:shadow-lg'}`}
          maxLength={100}
        />
        {errors.title && <p className="text-sm text-destructive animate-fade-in">{errors.title}</p>}
        <p className="text-xs text-muted-foreground">{formData.title.length}/100 characters</p>
      </div>

      {/* Description Field */}
      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-medium text-foreground">Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Describe your task in detail..."
          className={`min-h-[100px] transition-all duration-300 transform hover:scale-[1.01] focus:scale-[1.02] ${errors.description ? 'border-destructive focus:ring-destructive animate-pulse' : 'focus:ring-primary focus:shadow-lg'}`}
          maxLength={500}
        />
        {errors.description && <p className="text-sm text-destructive animate-fade-in">{errors.description}</p>}
        <p className="text-xs text-muted-foreground">{formData.description.length}/500 characters</p>
      </div>

      {/* Deadline Field */}
      <div className="space-y-2 relative" ref={calendarRef}>
        <Label className="text-sm font-medium text-foreground">Deadline</Label>
        <Button
          type="button"
          onClick={() => setCalendarOpen(prev => !prev)}
          variant="outline"
          className="w-full text-left"
        >
          {formData.deadline ? formData.deadline.toLocaleDateString() : 'Select a deadline'}
        </Button>
        {calendarOpen && (
          <div className="absolute z-10 mt-2 bg-white border rounded-lg shadow-lg">
            <DayPicker
              mode="single"
              selected={formData.deadline}
              onDayClick={(date) => {
                setFormData(prev => ({ ...prev, deadline: date }));
                setCalendarOpen(false);
              }}
            />
          </div>
        )}
      </div>

      {/* Priority Field */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-foreground">Priority</Label>
        <Select
          value={formData.priority}
          onValueChange={(value: 'low' | 'medium' | 'high') => setFormData(prev => ({ ...prev, priority: value }))}
        >
          <SelectTrigger className="w-full">
            <SelectValue className={getPriorityColor(formData.priority)} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low" className="text-success">🟢 Low Priority</SelectItem>
            <SelectItem value="medium" className="text-warning">🟡 Medium Priority</SelectItem>
            <SelectItem value="high" className="text-destructive">🔴 High Priority</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Status Field */}
      {task && (
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value: 'todo' | 'in-progress' | 'completed') => setFormData(prev => ({ ...prev, status: value }))}
          >
            <SelectTrigger className="w-full">
              <SelectValue className={getStatusColor(formData.status)} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todo" className="text-primary">📋 To Do</SelectItem>
              <SelectItem value="in-progress" className="text-warning">⚠️ In Progress</SelectItem>
              <SelectItem value="completed" className="text-success">✅ Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-gradient-primary hover:opacity-90 transition-all duration-200 transform hover:scale-[1.02]"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              {task ? 'Updating...' : 'Creating...'}
            </div>
          ) : (
            task ? '✏️ Update Task' : '➕ Create Task'
          )}
        </Button>
        {task && onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="flex-1 transition-all duration-200 hover:bg-muted"
          >
            ❌ Cancel
          </Button>
        )}
      </div>
    </form>
  );
};
