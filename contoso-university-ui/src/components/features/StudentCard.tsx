// StudentCard component - displays student information in a card format for grid layout
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Student } from '../../types/student';

/**
 * Props for the StudentCard component
 */
interface StudentCardProps {
  student: Student;
  onDelete: () => void;
}

/**
 * StudentCard - displays a single student's information in a card format
 * 
 * Educational note: This component uses the shadcn/ui Card component which provides
 * consistent styling and structure. The card is designed to work in a responsive grid
 * layout (1 column mobile, 2 columns tablet, 3 columns desktop).
 * 
 * The rounded-full class creates pill-shaped buttons that are more touch-friendly
 * and visually modern compared to standard rectangular buttons.
 * 
 * Performance: Memoized with React.memo to prevent unnecessary re-renders when
 * parent component state changes but this card's props haven't changed.
 * 
 * @param student - The student data to display
 * @param onDelete - Callback function when delete button is clicked
 */
const StudentCardComponent: React.FC<StudentCardProps> = ({ student, onDelete }) => {
  /**
   * Format date to locale string for better readability
   * Educational note: Using toLocaleDateString() respects user's locale settings
   */
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <CardTitle className="text-lg">{student.fullName}</CardTitle>
        <CardDescription>
          Enrolled: {formatDate(student.enrollmentDate)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-sm">
            <span className="text-muted-foreground font-medium">Last Name:</span>{' '}
            <span className="font-medium">{student.lastName}</span>
          </div>
          <div className="text-sm">
            <span className="text-muted-foreground font-medium">First Name:</span>{' '}
            <span className="font-medium">{student.firstMidName}</span>
          </div>
          <div className="text-sm">
            <span className="text-muted-foreground font-medium">Enrollments:</span>{' '}
            <span className="font-semibold">{student.enrollmentCount}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 justify-end">
        {/* Educational note: Pill-shaped buttons (rounded-full) are more modern and touch-friendly */}
        <Button variant="outline" size="sm" asChild className="rounded-full">
          <Link to={`/students/${student.id}`}>Details</Link>
        </Button>
        <Button variant="outline" size="sm" asChild className="rounded-full">
          <Link to={`/students/edit/${student.id}`}>Edit</Link>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="rounded-full text-destructive hover:bg-destructive hover:text-destructive-foreground"
          onClick={onDelete}
          aria-label={`Delete ${student.fullName}`}
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

/**
 * Export memoized version to prevent unnecessary re-renders
 * The component only re-renders when student or onDelete props change
 */
export const StudentCard = React.memo(StudentCardComponent);

export default StudentCard;
