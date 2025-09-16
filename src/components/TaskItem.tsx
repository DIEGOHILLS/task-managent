import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Task } from '../pages/Index';

interface TaskItemProps {
  task: Task;
  index: number;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  index,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  const getPriorityConfig = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return { color: 'bg-destructive text-destructive-foreground', icon: '🔴', label: 'High' };
      case 'medium':
        return { color: 'bg-warning text-warning-foreground', icon: '🟡', label: 'Medium' };
      case 'low':
        return { color: 'bg-success text-success-foreground', icon: '🟢', label: 'Low' };
    }
  };

  const getStatusConfig = (status: Task['status']) => {
    switch (status) {
      case 'todo':
        return { color: 'bg-primary text-primary-foreground', icon: '📋', label: 'To Do', nextAction: 'Start Task' };
      case 'in-progress':
        return { color: 'bg-warning text-warning-foreground', icon: '⚠️', label: 'In Progress', nextAction: 'Complete Task' };
      case 'completed':
        return { color: 'bg-success text-success-foreground', icon: '✅', label: 'Completed', nextAction: 'Reopen Task' };
    }
  };

  const priorityConfig = getPriorityConfig(task.priority);
  const statusConfig = getStatusConfig(task.status);

  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  const handleDelete = () => onDelete(task.id);

  return (
    <div
      className={`
        bg-card rounded-lg p-6 shadow-soft border border-border 
        transition-all duration-500 hover:shadow-elevated hover:scale-[1.02] hover:-translate-y-1
        animate-fade-in group cursor-pointer
        ${task.status === 'completed' ? 'opacity-75 hover:opacity-90' : ''}
      `}
      style={{ animationDelay: `${index * 150}ms` }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className={`
            text-lg font-semibold text-foreground mb-2 transition-all duration-300
            group-hover:text-primary
            ${task.status === 'completed' ? 'line-through opacity-70' : ''}
          `}>
            {task.title}
          </h3>
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge className={statusConfig.color}>
              {statusConfig.icon} {statusConfig.label}
            </Badge>
            <Badge className={priorityConfig.color}>
              {priorityConfig.icon} {priorityConfig.label} Priority
            </Badge>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mb-4">
        <p className={`text-muted-foreground leading-relaxed ${task.status === 'completed' ? 'opacity-70' : ''}`}>
          {task.description}
        </p>
      </div>

      {/* Metadata */}
      <div className="text-xs text-muted-foreground mb-4 space-y-1">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="flex items-center gap-1">📅 Created: {formatDate(new Date(task.createdAt))}</span>
          {task.updatedAt.getTime() !== task.createdAt.getTime() && (
            <span className="flex items-center gap-1">✏️ Updated: {formatDate(new Date(task.updatedAt))}</span>
          )}
          {task.deadline && (
            <span className="flex items-center gap-1">⏰ Deadline: {formatDate(new Date(task.deadline))}</span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
        <Button
          onClick={() => onToggleStatus(task.id)}
          variant="outline"
          size="sm"
          className="flex items-center gap-1 transition-all duration-300 hover:scale-110 hover:shadow-md active:scale-95"
        >
          {statusConfig.nextAction}
        </Button>

        <Button
          onClick={() => onEdit(task)}
          variant="outline"
          size="sm"
          className="flex items-center gap-1 transition-all duration-300 hover:scale-110 hover:shadow-md active:scale-95"
        >
          ✏️ Edit
        </Button>

        <Button
          onClick={handleDelete}
          variant="outline"
          size="sm"
          className="flex items-center gap-1 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all duration-300 hover:scale-110 hover:shadow-md active:scale-95"
        >
          🗑️ Delete
        </Button>
      </div>
    </div>
  );
};
