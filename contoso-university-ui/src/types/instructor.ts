// Instructor type definitions

export interface CourseAssignment {
  courseId: number;
  courseNumber: number;
  courseTitle: string;
  departmentName: string;
}

export interface Instructor {
  id: number;
  lastName: string;
  firstMidName: string;
  hireDate: string;
  fullName: string;
  officeLocation?: string;
  courseAssignments: CourseAssignment[];
}

export interface CreateInstructor {
  lastName: string;
  firstMidName: string;
  hireDate: string;
  officeLocation?: string;
  courseIDs: number[];
}

export interface UpdateInstructor {
  lastName: string;
  firstMidName: string;
  hireDate: string;
  officeLocation?: string;
  courseIDs: number[];
}
