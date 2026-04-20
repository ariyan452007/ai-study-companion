import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  BookOpen,
  CheckSquare,
  Sparkles,
  LogOut,
  BrainCircuit } from
'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/Button';

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Subjects', path: '/subjects', icon: BookOpen },
  { name: 'Tasks', path: '/tasks', icon: CheckSquare },
  { name: 'AI Tools', path: '/ai-tools', icon: Sparkles }];


  return (
    <div className="flex h-screen w-64 flex-col border-r bg-card px-3 py-4">
      <div className="mb-8 flex items-center gap-2 px-2">
        <BrainCircuit className="h-8 w-8 text-primary" />
        <span className="text-lg font-bold tracking-tight">StudyCompanion</span>
      </div>

      <div className="flex-1 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive ?
                "bg-primary/10 text-primary" :
                "text-muted-foreground hover:bg-muted hover:text-foreground"
              )
              }>
              
              <Icon className="h-4 w-4" />
              {item.name}
            </NavLink>);

        })}
      </div>

      <div className="mt-auto border-t pt-4">
        <div className="mb-4 px-2">
          <p className="text-sm font-medium">{user?.name}</p>
          <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
        </div>
        <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>);

};