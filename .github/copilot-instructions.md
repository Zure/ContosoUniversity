# ContosoUniversity Development Guidelines

Auto-generated from all feature plans. Last updated: 2025-11-12

## Active Technologies
- TypeScript 5.9.3, React 19.2.0, .NET 9.0 (backend - no changes required) (010-student-list-enhancement)
- SQL Server (via Docker/Podman) - no schema changes required (010-student-list-enhancement)

- C# / .NET 9.0 (backend), TypeScript 5.9.3 (frontend) (002-react-spa-migration)
- React 19.2.0, React Router DOM 7.9.5 (frontend framework) (002-react-spa-migration)
- Tailwind CSS 4.x, shadcn/ui (design system) (003-tailwind-shadcn-setup)
- SQL Server (existing database via Docker/Podman container, schema unchanged) (002-react-spa-migration)
- Vite 7.2.2 (frontend build tool) (002-react-spa-migration)

## Project Structure

```text
contoso-university-ui/
├── src/
│   ├── components/
│   │   ├── ui/          # shadcn/ui components (Button, Input, Card, Table, etc.)
│   │   ├── layout/      # Layout components (AppLayout, Navigation)
│   │   ├── common/      # Shared utility components
│   │   └── features/    # Feature-specific components
│   ├── lib/
│   │   └── utils.ts     # Utility functions (cn() for className merging)
│   ├── pages/           # Page components
│   ├── services/        # API services
│   ├── styles/
│   │   └── globals.css  # Tailwind directives & CSS variables
│   └── types/           # TypeScript types
├── components.json      # shadcn/ui configuration
├── tailwind.config.ts   # Tailwind CSS configuration
└── vite.config.ts       # Vite configuration with path aliases

ContosoUniversity/ (backend)
├── Controllers/
├── Models/
├── Services/
└── Data/
```

## Commands

### Frontend Development (contoso-university-ui/)

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Add shadcn/ui component
npx shadcn@latest add [component-name]
# Example: npx shadcn@latest add button

# Install dependencies
npm install
```

### Backend Development (ContosoUniversity/)

```bash
# Run backend
dotnet run

# Database migrations
dotnet ef migrations add [MigrationName]
dotnet ef database update
```

## Code Style

### Frontend (TypeScript/React)

**Import Patterns**:

```typescript
// Use @/ alias for project imports
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { StudentService } from "@/services/api/studentService";
```

**Component Style**:

```typescript
// Functional components with TypeScript
interface StudentListProps {
  initialPage?: number;
}

export function StudentList({ initialPage = 1 }: StudentListProps) {
  // Use hooks: useState, useEffect, custom hooks
  const [students, setStudents] = useState<Student[]>([]);

  return <div className="container mx-auto px-4 py-8">{/* Content */}</div>;
}
```

**Using Design System Components**:

```typescript
// Button with variants
<Button variant="default">Primary Action</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Cancel</Button>

// Table structure
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {/* rows */}
  </TableBody>
</Table>

// Use cn() for conditional classes
<div className={cn(
  "base-classes",
  condition && "conditional-classes"
)} />
```

**Styling Conventions**:

- Use Tailwind utility classes for styling
- Use shadcn/ui components instead of raw HTML elements
- Use `cn()` utility for conditional/merged classes
- Prefer design system colors over hardcoded values:
  - ✅ `bg-primary`, `text-foreground`, `border-border`
  - ❌ `bg-blue-500`, `text-gray-900`, `border-gray-300`

### Backend (C#/.NET)

C# / .NET 9.0: Follow standard conventions

## Design System Guidelines (003-tailwind-shadcn-setup)

### Available Components

- **Button**: Primary UI actions with variants (default, destructive, outline, secondary, ghost, link)
- **Input**: Form text inputs with proper label associations
- **Label**: Accessible form labels
- **Card**: Content containers with Header, Content, Footer sections
- **Table**: Data tables with responsive layout
- **Select**: Dropdown selections with keyboard navigation
- **Form**: Complete form solution with validation (react-hook-form + zod)
- **Dialog**: Modal dialogs for confirmations and data entry

### Color System

Use semantic color classes:

- `bg-background` / `text-foreground`: Page backgrounds and primary text
- `bg-primary` / `text-primary-foreground`: Primary actions and emphasis
- `bg-secondary` / `text-secondary-foreground`: Secondary actions
- `bg-muted` / `text-muted-foreground`: Disabled or de-emphasized content
- `bg-destructive` / `text-destructive-foreground`: Destructive actions (delete, remove)
- `border-border`: Standard borders
- `ring-ring`: Focus rings

### Typography Scale

- `text-xs`: 12px - Captions, labels
- `text-sm`: 14px - Small text, table cells
- `text-base`: 16px - Body text (default)
- `text-lg`: 18px - Large body text
- `text-xl`: 20px - Section headings
- `text-2xl`: 24px - Page titles
- `text-3xl`: 30px - Major headings

Font weights: `font-normal` (400), `font-medium` (500), `font-semibold` (600), `font-bold` (700)

### Spacing

Use Tailwind's spacing scale (4px increments):

- `p-2` / `m-2`: 8px
- `p-4` / `m-4`: 16px (default padding)
- `p-6` / `m-6`: 24px (section spacing)
- `p-8` / `m-8`: 32px (large spacing)
- `gap-2`, `gap-4`, `gap-6`: Grid/flex gaps

### Responsive Design

Use mobile-first responsive prefixes:

```typescript
className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
// 1 column on mobile, 2 on tablet (≥768px), 3 on desktop (≥1024px)
```

Breakpoints: `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px), `2xl` (1536px)

## Recent Changes
- 010-student-list-enhancement: Added TypeScript 5.9.3, React 19.2.0, .NET 9.0 (backend - no changes required)

- 003-tailwind-shadcn-setup: Added Tailwind CSS 4.x, shadcn/ui component library, design system with CSS variables, 8 core UI components
- 002-react-spa-migration: Added React 19.2.0, TypeScript 5.9.3, Vite 7.2.2

## Best Practices

### Component Usage

1. **Always use shadcn/ui components** instead of raw HTML elements:

   - ✅ `<Button>` instead of `<button>`
   - ✅ `<Input>` instead of `<input>`
   - ✅ `<Table>` family instead of raw `<table>`

2. **Use semantic component variants**:

   ```typescript
   <Button variant="destructive">Delete</Button>  // Not just red button
   <Button variant="outline">Cancel</Button>      // Not just gray button
   ```

3. **Leverage the cn() utility** for conditional styling:

   ```typescript
   import { cn } from "@/lib/utils";

   <div
     className={cn(
       "base-styles",
       isActive && "active-styles",
       isError && "error-styles"
     )}
   />;
   ```

4. **Use path aliases** for cleaner imports:
   ```typescript
   import { Button } from "@/components/ui/button"; // ✅
   import { Button } from "../../components/ui/button"; // ❌
   ```

### Accessibility

- Use semantic HTML elements where appropriate
- Ensure all interactive elements are keyboard accessible
- Provide proper ARIA labels via component props
- Test with keyboard navigation (Tab, Enter, Escape)
- Associate form labels with inputs using `htmlFor` and `id`

### Performance

- Components are tree-shakeable; only imported components are bundled
- Tailwind purges unused CSS classes in production
- Use React.lazy() for code splitting heavy components if needed

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
