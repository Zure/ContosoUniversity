// T022: React Router setup
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { NotificationProvider } from './context/NotificationContext';
import { AppLayout } from './components/layout/AppLayout';
import NotificationDisplay from './components/common/NotificationDisplay';
import StudentList from './pages/students/StudentList';
import CreateStudent from './pages/students/CreateStudent';
import EditStudent from './pages/students/EditStudent';
import StudentDetails from './pages/students/StudentDetails';
import CourseList from './pages/courses/CourseList';
import CreateCourse from './pages/courses/CreateCourse';
import EditCourse from './pages/courses/EditCourse';
import CourseDetails from './pages/courses/CourseDetails';
import EnrollmentList from './pages/enrollments/EnrollmentList';
import CreateEnrollment from './pages/enrollments/CreateEnrollment';
import EditEnrollment from './pages/enrollments/EditEnrollment';
import DepartmentList from './pages/departments/DepartmentList';
import CreateDepartment from './pages/departments/CreateDepartment';
import EditDepartment from './pages/departments/EditDepartment';
import DepartmentDetails from './pages/departments/DepartmentDetails';
import InstructorList from './pages/instructors/InstructorList';
import CreateInstructorPage from './pages/instructors/CreateInstructor';
import EditInstructorPage from './pages/instructors/EditInstructor';
import InstructorDetails from './pages/instructors/InstructorDetails';
import StatisticsPage from './pages/StatisticsPage';
import DesignSystemTest from './pages/DesignSystemTest';

// T163: Home page with navigation
const HomePage: React.FC = () => (
  <div className="max-w-7xl mx-auto px-4 py-12">
    <div className="text-center mb-12">
      <h1 className="text-4xl font-bold text-foreground mb-4">Welcome to Contoso University</h1>
      <p className="text-xl text-muted-foreground">
        Modern student information system built with React and ASP.NET Core
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-card text-card-foreground p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-border">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-4">
            <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-foreground">Students</h2>
        </div>
        <p className="text-muted-foreground mb-4">
          Manage student information, view enrollment history, and track academic progress.
        </p>
        <a href="/students" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium">
          Go to Students →
        </a>
      </div>

      <div className="bg-card text-card-foreground p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-border">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mr-4">
            <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-foreground">Courses</h2>
        </div>
        <p className="text-muted-foreground mb-4">
          Browse course catalog, manage course details, and assign instructors.
        </p>
        <a href="/courses" className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 font-medium">
          Go to Courses →
        </a>
      </div>

      <div className="bg-card text-card-foreground p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-border">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mr-4">
            <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-foreground">Enrollments</h2>
        </div>
        <p className="text-muted-foreground mb-4">
          Register students for courses, manage grades, and view enrollment records.
        </p>
        <a href="/enrollments" className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 font-medium">
          Go to Enrollments →
        </a>
      </div>

      <div className="bg-card text-card-foreground p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-border">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center mr-4">
            <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-foreground">Departments</h2>
        </div>
        <p className="text-muted-foreground mb-4">
          Manage academic departments, budgets, and department administrators.
        </p>
        <a href="/departments" className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-300 font-medium">
          Go to Departments →
        </a>
      </div>

      <div className="bg-card text-card-foreground p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-border">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center mr-4">
            <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-foreground">Instructors</h2>
        </div>
        <p className="text-muted-foreground mb-4">
          Manage instructor profiles, office locations, and course assignments.
        </p>
        <a href="/instructors" className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium">
          Go to Instructors →
        </a>
      </div>

      <div className="bg-card text-card-foreground p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-border">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center mr-4">
            <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-foreground">Statistics</h2>
        </div>
        <p className="text-muted-foreground mb-4">
          View enrollment statistics, trends, and analytics dashboard.
        </p>
        <a href="/statistics" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium">
          Go to Statistics →
        </a>
      </div>
    </div>

    <div className="mt-12 text-center">
      <div className="bg-muted border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Technology Stack
        </h3>
        <p className="text-muted-foreground">
          React 19 • TypeScript • ASP.NET Core 9.0 • Entity Framework Core • SQL Server
        </p>
      </div>
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <NotificationProvider>
      <BrowserRouter>
        <AppLayout>
          <NotificationDisplay />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/students" element={<StudentList />} />
            <Route path="/students/create" element={<CreateStudent />} />
            <Route path="/students/edit/:id" element={<EditStudent />} />
            <Route path="/students/:id" element={<StudentDetails />} />
            <Route path="/courses" element={<CourseList />} />
            <Route path="/courses/create" element={<CreateCourse />} />
            <Route path="/courses/edit/:id" element={<EditCourse />} />
            <Route path="/courses/:id" element={<CourseDetails />} />
            <Route path="/enrollments" element={<EnrollmentList />} />
            <Route path="/enrollments/create" element={<CreateEnrollment />} />
            <Route path="/enrollments/edit/:id" element={<EditEnrollment />} />
            <Route path="/departments" element={<DepartmentList />} />
            <Route path="/departments/create" element={<CreateDepartment />} />
            <Route path="/departments/edit/:id" element={<EditDepartment />} />
            <Route path="/departments/:id" element={<DepartmentDetails />} />
            <Route path="/instructors" element={<InstructorList />} />
            <Route path="/instructors/create" element={<CreateInstructorPage />} />
            <Route path="/instructors/edit/:id" element={<EditInstructorPage />} />
            <Route path="/instructors/:id" element={<InstructorDetails />} />
            <Route path="/statistics" element={<StatisticsPage />} />
            <Route path="/design-system-test" element={<DesignSystemTest />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </NotificationProvider>
  );
};

export default App;

