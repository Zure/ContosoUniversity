/**
 * StudentDeleteDialog - Accessible confirmation dialog for student deletion
 * 
 * Features:
 * - Modal overlay with focus trap for accessibility
 * - Clear messaging with student name for context
 * - Destructive variant for delete confirmation
 * - Loading state during API call
 * - Keyboard navigation (Escape to cancel, Enter to confirm)
 */

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Loader2 } from 'lucide-react';

export interface StudentDeleteDialogProps {
  isOpen: boolean;
  studentName: string;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function StudentDeleteDialog({
  isOpen,
  studentName,
  isDeleting,
  onConfirm,
  onCancel,
}: StudentDeleteDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open: boolean) => !open && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Student</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <strong>{studentName}</strong>?
            This action cannot be undone and will permanently remove the student
            and all associated enrollment records.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.preventDefault();
              onConfirm();
            }}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
