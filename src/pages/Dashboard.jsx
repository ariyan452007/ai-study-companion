import React, { useMemo } from 'react';
import { useData } from '@/context/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { BookOpen, CheckCircle2, Clock, CalendarDays } from 'lucide-react';
import { format, subDays, isSameDay } from 'date-fns';

export const Dashboard = () => {
  const { tasks, subjects } = useData();

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'Completed').length;
    const pending = tasks.filter((t) => t.status === 'Pending').length;
    const overdue = tasks.filter((t) => t.status === 'Overdue').length;
    const completionRate = total ? Math.round(completed / total * 100) : 0;

    return { total, completed, pending, overdue, completionRate };
  }, [tasks]);

  const weeklyActivity = useMemo(() => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dayTasks = tasks.filter((t) => t.status === 'Completed' && isSameDay(new Date(t.createdAt), date));
      data.push({
        name: format(date, 'EEE'),
        tasks: dayTasks.length
      });
    }
    return data;
  }, [tasks]);

  const subjectProgress = useMemo(() => {
    return subjects.map((subject) => {
      const subjectTasks = tasks.filter((t) => t.subjectId === subject.id);
      const completedTasks = subjectTasks.filter((t) => t.status === 'Completed');
      const progress = subjectTasks.length ? Math.round(completedTasks.length / subjectTasks.length * 100) : 0;
      return {
        name: subject.name,
        progress,
        color: subject.color || '#3b82f6'
      };
    });
  }, [subjects, tasks]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of your study progress and upcoming tasks.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <CalendarDays className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completionRate}%</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Weekly Activity</CardTitle>
            <CardDescription>Completed tasks over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyActivity}>
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                  <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="tasks" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Subject Progress</CardTitle>
            <CardDescription>Completion percentage per subject</CardDescription>
          </CardHeader>
          <CardContent>
            {subjectProgress.length > 0 ?
            <div className="space-y-6">
                {subjectProgress.map((item) =>
              <div key={item.name} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-muted-foreground">{item.progress}%</div>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                      <div
                    className="h-full bg-primary transition-all duration-500 ease-in-out"
                    style={{ width: `${item.progress}%`, backgroundColor: item.color }} />
                  
                    </div>
                  </div>
              )}
              </div> :

            <div className="flex h-[250px] items-center justify-center text-sm text-muted-foreground">
                No subjects added yet.
              </div>
            }
          </CardContent>
        </Card>
      </div>
    </div>);

};