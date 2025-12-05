# Quickstart: Dark Mode Theme Support

**Feature**: 004-dark-mode  
**Date**: 2025-12-05

## Prerequisites

- Node.js and npm installed
- Frontend development server running
- Modern browser (Chrome, Firefox, Safari, or Edge)

## Quick Test

### 1. Start the Development Server

```bash
cd contoso-university-ui
npm run dev
```

### 2. Open the Application

Navigate to `http://localhost:5173` (or the URL shown in terminal)

### 3. Test Theme Toggle

1. **Locate the toggle**: Look for the sun/moon icon button in the top-right corner of the navigation bar
2. **Click the toggle**: A dropdown menu appears with three options:
   - ☀️ Light
   - 🌙 Dark
   - 💻 System

### 4. Verify Theme Changes

| Action          | Expected Result                                                |
| --------------- | -------------------------------------------------------------- |
| Select "Dark"   | Background turns dark, text turns light, all components update |
| Select "Light"  | Background turns light, text turns dark                        |
| Select "System" | Theme matches your OS preference                               |

### 5. Test Persistence

1. Select "Dark" mode
2. Close the browser tab completely
3. Reopen `http://localhost:5173`
4. ✅ Dark mode should be automatically applied

### 6. Test System Preference

1. Select "System" mode in the app
2. Change your OS theme preference:
   - **macOS**: System Preferences → Appearance → Light/Dark
   - **Windows**: Settings → Personalization → Colors → Light/Dark
3. ✅ App should immediately update to match OS preference

## Keyboard Navigation Test

1. Press `Tab` repeatedly until the theme toggle is focused
2. Press `Enter` or `Space` to open the dropdown
3. Use `Arrow Up/Down` to navigate options
4. Press `Enter` to select
5. Press `Escape` to close without selecting

## Accessibility Test

1. Enable a screen reader (VoiceOver on macOS, NVDA on Windows)
2. Navigate to the theme toggle
3. Verify the button announces: "Toggle theme" or similar
4. Verify each option is announced when navigating the dropdown

## Visual Checklist

After switching to dark mode, verify these components display correctly:

- [ ] Navigation bar (dark background, light text)
- [ ] Page titles and headings (light text)
- [ ] Data tables (proper contrast, visible borders)
- [ ] Form inputs (dark background, light text, visible borders)
- [ ] Buttons (correct variant colors)
- [ ] Cards (dark background)
- [ ] Dialogs/modals (dark background)
- [ ] Links (visible and distinguishable)

## Troubleshooting

| Issue                   | Solution                                               |
| ----------------------- | ------------------------------------------------------ |
| Toggle not visible      | Check if Navigation.tsx includes ThemeToggle component |
| Theme not persisting    | Check browser localStorage permissions                 |
| Flash of wrong theme    | Verify inline script in index.html                     |
| System mode not working | Check browser supports `prefers-color-scheme`          |

## Files to Check

```
contoso-university-ui/src/
├── context/ThemeContext.tsx     # Theme provider logic
├── hooks/useTheme.ts            # Custom hook for theme access
├── components/common/ThemeToggle.tsx  # Toggle UI component
├── components/layout/Navigation.tsx   # Contains toggle
└── index.html                   # FOUC prevention script
```
