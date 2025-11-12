import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { GraduationCap } from 'lucide-react';

export function Navigation() {
  const location = useLocation();

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Students', path: '/students' },
    { label: 'Courses', path: '/courses' },
    { label: 'Instructors', path: '/instructors' },
    { label: 'Departments', path: '/departments' },
    { label: 'Statistics', path: '/statistics' },
  ];

  return (
    <nav className="border-b border-border bg-background">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Brand */}
          <Link 
            to="/" 
            className="flex items-center gap-2 text-xl font-semibold text-foreground hover:text-primary transition-colors"
          >
            <GraduationCap className="h-6 w-6" />
            <span>Contoso University</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || 
                              (item.path !== '/' && location.pathname.startsWith(item.path));
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
