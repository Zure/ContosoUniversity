// Course type definitions
export interface Course {
  courseId: number;
  courseNumber: number;
  title: string;
  credits: number;
  departmentId: number;
  departmentName: string;
  enrollmentCount: number;
  rowVersion?: Uint8Array;
}

export interface CreateCourse {
  courseNumber: number;
  title: string;
  credits: number;
  departmentId: number;
}

export interface UpdateCourse {
  title: string;
  credits: number;
  departmentId: number;
  rowVersion?: Uint8Array;
}

export interface Department {
  departmentId: number;
  name: string;
  budget: number;
  startDate: string;
  instructorId?: number;
  administratorName?: string;
  courseCount: number;
  rowVersion?: Uint8Array;
}

export interface CreateDepartment {
  name: string;
  budget: number;
  startDate: string;
  instructorId?: number;
}

export interface UpdateDepartment {
  name: string;
  budget: number;
  startDate: string;
  instructorId?: number;
  rowVersion?: Uint8Array;
}
