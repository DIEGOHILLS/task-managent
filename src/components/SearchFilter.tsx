import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface SearchFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterStatus: string;
  onStatusChange: (status: string) => void;
  filterPriority: string;
  onPriorityChange: (priority: string) => void;
}

export const SearchFilter: React.FC<SearchFilterProps> = ({
  searchQuery,
  onSearchChange,
  filterStatus,
  onStatusChange,
  filterPriority,
  onPriorityChange,
}) => {
  const clearFilters = () => {
    onSearchChange('');
    onStatusChange('all');
    onPriorityChange('all');
  };

  const hasActiveFilters = searchQuery || filterStatus !== 'all' || filterPriority !== 'all';

  return (
    <div className="bg-card rounded-lg p-6 shadow-soft border border-border animate-fade-in hover:shadow-elevated transition-all duration-500 hover:-translate-y-1">
      <h3 className="text-lg font-semibold text-foreground mb-4 animate-bounce-in">
        🔍 Search & Filter Tasks
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search Input */}
        <div className="space-y-2 animate-fade-in" style={{animationDelay: "100ms"}}>
          <Label htmlFor="search" className="text-sm font-medium text-foreground">
            Search Tasks
          </Label>
          <Input
            id="search"
            type="text"
            placeholder="Search by title or description..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="transition-all duration-300 focus:ring-primary focus:scale-[1.02] hover:shadow-md"
          />
        </div>

        {/* Status Filter */}
        <div className="space-y-2 animate-fade-in" style={{animationDelay: "200ms"}}>
          <Label className="text-sm font-medium text-foreground">
            Filter by Status
          </Label>
          <Select value={filterStatus} onValueChange={onStatusChange}>
            <SelectTrigger className="w-full transition-all duration-300 hover:scale-[1.02] hover:shadow-md">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">🌐 All Statuses</SelectItem>
              <SelectItem value="todo" className="text-primary">
                📋 To Do
              </SelectItem>
              <SelectItem value="in-progress" className="text-warning">
                ⚠️ In Progress
              </SelectItem>
              <SelectItem value="completed" className="text-success">
                ✅ Completed
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Priority Filter */}
        <div className="space-y-2 animate-fade-in" style={{animationDelay: "300ms"}}>
          <Label className="text-sm font-medium text-foreground">
            Filter by Priority
          </Label>
          <Select value={filterPriority} onValueChange={onPriorityChange}>
            <SelectTrigger className="w-full transition-all duration-300 hover:scale-[1.02] hover:shadow-md">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">🌈 All Priorities</SelectItem>
              <SelectItem value="high" className="text-destructive">
                🔴 High Priority
              </SelectItem>
              <SelectItem value="medium" className="text-warning">
                🟡 Medium Priority
              </SelectItem>
              <SelectItem value="low" className="text-success">
                🟢 Low Priority
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-border animate-fade-in">
          <Button
            onClick={clearFilters}
            variant="outline"
            size="sm"
            className="transition-all duration-300 hover:bg-muted hover:scale-110 active:scale-95"
          >
            🧹 Clear All Filters
          </Button>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-3 flex flex-wrap gap-2 animate-fade-in">
          {searchQuery && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded text-xs animate-bounce-in">
              🔍 Search: "{searchQuery}"
            </span>
          )}
          {filterStatus !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-warning/10 text-warning rounded text-xs animate-bounce-in">
              📊 Status: {filterStatus}
            </span>
          )}
          {filterPriority !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-success/10 text-success rounded text-xs animate-bounce-in">
              🎯 Priority: {filterPriority}
            </span>
          )}
        </div>
      )}
    </div>
  );
};