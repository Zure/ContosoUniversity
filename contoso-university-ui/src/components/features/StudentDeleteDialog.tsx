import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

/**
 * Props for the StudentDeleteDialog component
 */
export interface StudentDeleteDialogProps {
  isOpen: boolean;
  studentName: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean;
}

/**
 * Confirmation dialog for deleting a student record
 * 
 * This component displays a modal dialog to confirm student deletion.
 * It provides clear feedback about which student is being deleted and
 * warns that the action cannot be undone.
 * 
 * @example
 * ```tsx
 * <StudentDeleteDialog
 *   isOpen={deleteDialog.isOpen}
 *   studentName={deleteDialog.studentName}
 *   onConfirm={handleDeleteConfirm}
 *   onCancel={handleDeleteCancel}
 *   isDeleting={isDeleting}
 * />
 * ```
 */
export const StudentDeleteDialog: React.FC<StudentDeleteDialogProps> = ({
  isOpen,
  studentName,
  onConfirm,
  onCancel,
  isDeleting = false,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Student</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong>{studentName}</strong>? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
