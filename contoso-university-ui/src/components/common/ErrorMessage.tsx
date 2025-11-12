// T068: Error message component with design system colors and Button
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ErrorMessageProps {
  message: string;
  title?: string;
  onRetry?: () => void;
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  title = 'Error',
  onRetry,
  className = '',
}) => {
  return (
    <div
      className={cn(
        'bg-destructive/10 border border-destructive/30 rounded-lg p-4',
        className
      )}
      role="alert"
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-destructive" aria-hidden="true" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-destructive">{title}</h3>
          <div className="mt-2 text-sm text-destructive/90">
            <p>{message}</p>
          </div>
          {onRetry && (
            <div className="mt-4">
              <Button
                type="button"
                onClick={onRetry}
                variant="outline"
                size="sm"
                className="border-destructive/30 text-destructive hover:bg-destructive/10"
              >
                Try Again
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
