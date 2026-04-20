import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Plus, Search, Calendar, AlertCircle, CheckCircle2 } from 'lucide-react';
import { format, isPast, isToday } from 'date-fns';

import { cn } from '@/lib/utils';



export const Tasks = () => {
  const { tasks, subjects, topics, addTask, updateTask, deleteTask } = useData();
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddTask = () => {
    if (subjects.length === 0) {
      alert("Please create a subject first!");
      return;
    }
    const title = prompt('Enter task title:');
    if (title) {
      const subject = subjects[0]; // Just picking first for demo
      addTask({
        title,
        subjectId: subject.id,
        deadline: new Date(Date.now() + 86400000 * 3).toISOString(), // 3 days from now
        priority: 'Medium',
        status: 'Pending'
      });
    }
  };

  const toggleTaskStatus = (task) => {
    const newStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
    updateTask(task.id, { status: newStatus });
  };

  const tabs = ['All', 'Pending', 'Completed', 'Overdue', 'Revision'];

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    const deadlineDate = new Date(task.deadline);
    const isTaskOverdue = isPast(deadlineDate) && !isToday(deadlineDate) && task.status !== 'Completed';

    switch (activeTab) {
      case 'Pending':return task.status === 'Pending' && !isTaskOverdue;
      case 'Completed':return task.status === 'Completed';
      case 'Overdue':return task.status === 'Overdue' || isTaskOverdue;
      case 'Revision':return task.title.toLowerCase().includes('revise') || task.title.toLowerCase().includes('revision');
      default:return true;
    }
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Study Tasks</h1>
          <p className="text-muted-foreground mt-1">Manage your deadlines and stay on top of your studies.</p>
        </div>
        <Button onClick={handleAddTask} className="gap-2">
          <Plus className="h-4 w-4" /> Add Task
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex space-x-1 bg-muted p-1 rounded-lg overflow-x-auto max-w-full">
          {tabs.map((tab) =>
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-1.5 text-sm font-medium rounded-md whitespace-nowrap transition-all",
              activeTab === tab ?
              "bg-background text-foreground shadow-sm" :
              "text-muted-foreground hover:text-foreground hover:bg-background/50"
            )}>
            
              {tab}
            </button>
          )}
        </div>
        
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            className="pl-9 w-full sm:w-[250px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} />
          
        </div>
      </div>

      {filteredTasks.length === 0 ?
      <div className="flex flex-col items-center justify-center p-12 text-center border rounded-xl bg-card border-dashed">
          <CheckCircle2 className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-lg font-semibold">No tasks found</h3>
          <p className="text-sm text-muted-foreground mt-2 max-w-sm">
            You don't have any tasks matching the current filters.
          </p>
        </div> :

      <div className="space-y-3">
          {filteredTasks.map((task) => {
          const subject = subjects.find((s) => s.id === task.subjectId);
          const topic = topics.find((t) => t.id === task.topicId);
          const isCompleted = task.status === 'Completed';
          const deadlineDate = new Date(task.deadline);
          const isTaskOverdue = isPast(deadlineDate) && !isToday(deadlineDate) && !isCompleted;

          return (
            <Card key={task.id} className={cn("transition-all hover:shadow-md", isCompleted ? "opacity-75 bg-muted/30" : "")}>
                <CardContent className="p-4 flex items-center gap-4">
                  <button
                  onClick={() => toggleTaskStatus(task)}
                  className={cn(
                    "flex-shrink-0 h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors",
                    isCompleted ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground hover:border-primary"
                  )}>
                  
                    {isCompleted && <CheckCircle2 className="h-4 w-4" />}
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={cn("font-medium truncate text-base", isCompleted ? "line-through text-muted-foreground" : "")}>
                        {task.title}
                      </h4>
                      {task.priority === 'High' && !isCompleted &&
                    <Badge variant="destructive" className="h-5 text-[10px] uppercase">High Priority</Badge>
                    }
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                      {subject &&
                    <div className="flex items-center gap-1.5">
                          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: subject.color }} />
                          <span className="truncate max-w-[120px]">{subject.name}</span>
                          {topic && <span className="text-muted-foreground/50 mx-1">•</span>}
                          {topic && <span className="truncate max-w-[120px]">{topic.name}</span>}
                        </div>
                    }
                      
                      <div className={cn("flex items-center gap-1.5", isTaskOverdue ? "text-destructive font-medium" : "")}>
                        {isTaskOverdue ? <AlertCircle className="h-3.5 w-3.5" /> : <Calendar className="h-3.5 w-3.5" />}
                        <span>{format(deadlineDate, 'MMM d, yyyy')}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive opacity-0 hover:opacity-100 transition-opacity focus:opacity-100 hidden sm:flex"
                  onClick={() => deleteTask(task.id)}>
                  
                    Delete
                  </Button>
                </CardContent>
              </Card>);

        })}
        </div>
      }
    </div>);

};