// T091: Enrollment TypeScript interfaces
export interface Enrollment {
  enrollmentID: number;
  courseID: number;
  courseTitle: string;
  studentID: number;
  studentName: string;
  grade?: GradeValue;
}

export interface CreateEnrollment {
  courseID: number;
  studentID: number;
  grade?: GradeValue;
}

export interface UpdateEnrollment {
  grade?: GradeValue;
}

export type GradeValue = 'A' | 'B' | 'C' | 'D' | 'F';

export const GRADE_OPTIONS: GradeValue[] = ['A', 'B', 'C', 'D', 'F'];
