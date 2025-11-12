# Lab 5: Advanced UI Patterns (Optional)

## Overview

> **Note**: If you're following the lab sequence, Tailwind CSS and shadcn/ui were set up in **Lab 2, Part 5**. This lab focuses on advanced patterns and enhancements.

Use Spec-Kit and GitHub Copilot to implement advanced UI patterns in the Contoso University application. Build on the design system established in Lab 2 to create sophisticated user interface components and interactions.

## Learning Objectives

- Implement advanced data visualization patterns
- Create complex form interactions with validation
- Build responsive data tables with advanced features
- Add animations and micro-interactions
- Establish accessibility best practices

## Prerequisites

- Completed Lab 1 (spec-kit basics)
- Completed Lab 2 (React UI with Tailwind/shadcn setup)
- GitHub Copilot enabled in your IDE
- Basic understanding of Tailwind CSS and shadcn/ui

## Duration

Approximately 90-120 minutes

---

## Part 1: Advanced Table Features

### Step 1: Specify Enhanced Data Table

```bash
/speckit.specify Enhance the Students table with advanced features: multi-column sorting, column filtering, bulk actions (select multiple students), export to CSV, column visibility toggle, and saved table preferences. Maintain performance with large datasets and ensure full accessibility.
```

### Step 2: Plan and Implement

```bash
/speckit.plan Create a plan for advanced table features using shadcn/ui Table and TanStack Table library.

/speckit.tasks
/speckit.implement
```

### Step 3: Test Advanced Features

Verify:

- [ ] Multi-column sorting works
- [ ] Filters apply correctly
- [ ] Bulk selection functional
- [ ] CSV export includes filtered data
- [ ] Table preferences persist across sessions
- [ ] Performance good with 1000+ rows

---

## Part 2: Complex Form Patterns

### Step 1: Create Multi-Step Form

```bash
/speckit.specify Create a multi-step enrollment form for students to register for courses. Include: step navigation, validation per step, ability to go back/forward, progress indicator, save draft functionality, and comprehensive error handling.
```

### Step 2: Implement with React Hook Form

```bash
/speckit.plan Use React Hook Form with Zod validation and shadcn/ui form components.

/speckit.implement
```

### Step 3: Add Real-Time Validation

```bash
/speckit.clarify Add real-time validation feedback: show field errors as user types (debounced), indicate required fields clearly, show overall form progress, and disable navigation if current step is invalid.
```

---

## Part 3: Data Visualization

### Step 1: Enrollment Statistics Dashboard

```bash
/speckit.specify Create a dashboard showing enrollment statistics: enrollment trends over time (line chart), students by department (bar chart), course popularity (pie chart), and key metrics cards. Use Recharts library for visualizations.
```

### Step 2: Implement Responsive Charts

```bash
/speckit.implement Build the dashboard with responsive charts that adapt to mobile layouts.
```

---

## Part 4: Advanced Interactions

### Step 1: Drag-and-Drop Course Scheduling

```bash
/speckit.specify Implement drag-and-drop interface for instructors to schedule courses. Users should be able to drag courses to time slots in a weekly calendar view, with conflict detection and visual feedback.
```

### Step 2: Add Animations

```bash
/speckit.clarify Add smooth animations using Framer Motion: page transitions, modal animations, list item animations when adding/removing, and loading skeletons.
```

---

## Part 5: Accessibility Excellence

### Step 1: Comprehensive Accessibility Audit

```bash
/speckit.specify Conduct full accessibility audit of all pages and components. Ensure WCAG 2.1 AA compliance: keyboard navigation, screen reader support, focus management, color contrast, and semantic HTML.
```

### Step 2: Implement Focus Management

```bash
/speckit.implement Add proper focus management: focus trap in modals, focus restoration after actions, skip links, and clear focus indicators throughout the app.
```

---

## Part 6: Performance Optimization

### Step 1: Optimize Large Lists

```bash
/speckit.specify Implement virtual scrolling for large lists (100+ items) using React Virtual. Ensure smooth scrolling performance and maintain accessibility.
```

### Step 2: Code Splitting

```bash
/speckit.implement Add route-based code splitting to reduce initial bundle size. Lazy load page components with loading states.
```

---

## Key Takeaways

1. **Advanced Patterns**: Building on solid foundations enables sophisticated features
2. **Performance Matters**: Large datasets require virtualization and optimization
3. **Accessibility First**: Complex interactions need careful accessibility considerations
4. **Progressive Enhancement**: Start with basics (Lab 2), then add advanced features
5. **User Experience**: Animations and micro-interactions improve perceived performance

## What's Next

With advanced UI patterns:

- **Lab 6**: Implement course-instructor assignment workflows
- **Lab 7**: Build complex scheduling interfaces
- **Lab 8**: Create student registration flows
- **Lab 9**: Develop semester-based views

## Challenge Extensions

1. **Real-Time Collaboration**: Add WebSocket support for live updates
2. **Offline Support**: Implement service worker for offline functionality
3. **Internationalization**: Add i18n support with multiple languages
4. **Advanced Analytics**: Track user interactions and build heatmaps

## Troubleshooting

### Performance Issues with Large Tables

```
Ask Copilot: "My table is slow with 1000+ rows. Help me implement virtualization with TanStack Table and React Virtual while maintaining sorting and filtering features."
```

### Animation Jank

```
"My animations are janky. Review my Framer Motion usage and suggest optimizations: use transform properties, will-change hints, and reduce layout thrashing."
```

## Resources

- [Spec-Kit Quickstart Guide](https://github.github.io/spec-kit/quickstart.html)
- [TanStack Table Documentation](https://tanstack.com/table)
- [React Hook Form](https://react-hook-form.com/)
- [Recharts](https://recharts.org/)
- [Framer Motion](https://www.framer.com/motion/)
- [React Virtual](https://tanstack.com/virtual)

---

**Continue to Lab 6** to implement course-instructor assignment workflows using these advanced patterns!
