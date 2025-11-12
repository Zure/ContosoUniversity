# Contoso University - Frontend

Modern React-based UI for the Contoso University student information system.

## Technology Stack

- **React 19.0.0** - UI framework
- **TypeScript 5.x** - Type safety
- **Vite 7.2.2** - Build tool and dev server
- **React Router DOM v6** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS framework

## Prerequisites

- Node.js 18+ and npm 9+
- Backend API running on `https://localhost:7192`

## Getting Started

### Install Dependencies

```bash
npm install
```

### Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
contoso-university-ui/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── common/         # Generic components (LoadingSpinner, ErrorMessage, etc.)
│   │   └── features/       # Feature-specific components (forms, etc.)
│   ├── context/            # React context providers (notifications, etc.)
│   ├── hooks/              # Custom React hooks (usePagination, etc.)
│   ├── pages/              # Page components (Students, Courses, etc.)
│   ├── services/           # API clients and utilities
│   │   └── api/            # Backend API services
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions (formatters, validation)
│   ├── App.tsx             # Main app component with routing
│   └── main.tsx            # Application entry point
├── public/                 # Static assets
└── package.json            # Project dependencies and scripts
```

## Available Features

### Student Management

- View all students with pagination and search
- Create new students
- Edit student information
- View student details with enrollment history
- Delete students

### Course Management

- Browse course catalog with filtering
- Create new courses
- Edit course details
- View course information
- Delete courses

### Enrollment Management

- View enrollments with dual filtering (by student or course)
- Register students for courses
- Update grades
- Remove enrollments
- Duplicate enrollment prevention

### Department Management

- List departments with search
- Create departments with budget and administrator
- Edit department information
- View department details with course count
- Delete departments (with protection for departments with courses)

### Instructor Management

- View instructors with search
- Create instructor profiles with office locations
- Assign multiple courses to instructors
- Edit instructor information
- View instructor details with course assignments
- Delete instructors (with protection for department administrators)

### Statistics Dashboard

- View enrollment statistics by date
- Analyze student enrollment trends
- Visual percentage bars for data representation

## API Configuration

The frontend connects to the backend API at `https://localhost:7192`. This is configured in:

```typescript
// src/services/api/client.ts
const apiClient = axios.create({
  baseURL: "https://localhost:7192/api",
  headers: {
    "Content-Type": "application/json",
  },
});
```

To change the API URL, modify the `baseURL` in `src/services/api/client.ts`.

## Development Guidelines

### Adding a New Feature

1. **Create TypeScript types** in `src/types/`
2. **Create API service** in `src/services/api/`
3. **Create components** in `src/components/features/` or `src/components/common/`
4. **Create pages** in `src/pages/`
5. **Add routes** in `src/App.tsx`
6. **Update navigation** in `src/components/common/NavigationBar.tsx`

### Code Style

- Use functional components with hooks
- Use TypeScript for type safety
- Follow React best practices (hooks rules, immutability, etc.)
- Use async/await for API calls
- Handle loading and error states
- Use the notification context for user feedback

### Component Patterns

**List Component:**

```typescript
- Pagination support
- Search/filter functionality
- Loading and error states
- Action buttons (edit, delete)
- Links to detail pages
```

**Form Component:**

```typescript
- Client-side validation
- Error messages
- Submit and cancel actions
- Loading state during submission
- Reusable for create and edit
```

**Detail Component:**

```typescript
- Display all entity information
- Action buttons (edit, delete)
- Related entity links
- Back navigation
```

## Common Issues

### CORS Errors

Ensure the backend API has CORS configured to allow requests from `http://localhost:5173`

### API Connection Refused

Verify the backend API is running on `https://localhost:7192`

### SSL Certificate Warnings

The development backend uses a self-signed certificate. In development, this is expected.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Environment Variables

Create a `.env` file for environment-specific configuration:

```env
VITE_API_URL=https://localhost:7192/api
```

Access in code:

```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

## Contributing

1. Follow the established code structure
2. Add TypeScript types for all data
3. Handle errors gracefully
4. Provide user feedback via notifications
5. Test all CRUD operations
6. Ensure responsive design

## License

Educational project for learning purposes.
