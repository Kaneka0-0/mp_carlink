# Component Documentation

## Overview

This document provides detailed information about the reusable components used in the MP CarLink application. The components are built using Radix UI primitives and styled with Tailwind CSS.

## Component Categories

### 1. Layout Components

#### ThemeProvider
```tsx
import { ThemeProvider } from '@/components/theme-provider'
```
A context provider for theme management that enables dark/light mode switching.

**Props:**
- `children`: ReactNode
- `attribute`: string (default: "class")
- `defaultTheme`: string (default: "system")
- `enableSystem`: boolean (default: true)
- `storageKey`: string (default: "mp-carlink-theme")

**Usage:**
```tsx
<ThemeProvider>
  <App />
</ThemeProvider>
```

### 2. UI Components

The UI components are organized in the `components/ui` directory and include:

#### Form Components
- Input
- Textarea
- Select
- Checkbox
- Radio
- Switch
- Button

#### Navigation Components
- NavigationMenu
- Tabs
- Breadcrumb

#### Feedback Components
- Alert
- Toast
- Progress
- Spinner

#### Data Display Components
- Table
- Card
- Badge
- Avatar

#### Overlay Components
- Dialog
- Popover
- Tooltip
- DropdownMenu

## Component Usage Guidelines

### Best Practices

1. **Importing Components**
   ```tsx
   import { ComponentName } from '@/components/ui/component-name'
   ```

2. **Props Naming Convention**
   - Use camelCase for prop names
   - Prefix boolean props with 'is', 'has', or 'should'
   - Use descriptive names that indicate the prop's purpose

3. **Styling**
   - Use Tailwind CSS classes for styling
   - Follow the design system's spacing and color tokens
   - Maintain consistent padding and margin scales

4. **Accessibility**
   - Include appropriate ARIA attributes
   - Ensure keyboard navigation support
   - Maintain proper focus management
   - Provide sufficient color contrast

### Common Props

Most components accept the following common props:

- `className`: string - Additional CSS classes
- `disabled`: boolean - Disables the component
- `onClick`: function - Click event handler
- `children`: ReactNode - Component content

## Component Examples

### Button Component
```tsx
import { Button } from '@/components/ui/button'

// Primary button
<Button variant="primary">Click me</Button>

// Secondary button
<Button variant="secondary">Click me</Button>

// Disabled button
<Button disabled>Cannot click</Button>
```

### Input Component
```tsx
import { Input } from '@/components/ui/input'

// Basic input
<Input placeholder="Enter text" />

// With label
<Input label="Username" placeholder="Enter username" />

// With error
<Input error="Invalid input" />
```

## Component Development

### Creating New Components

1. Create a new file in the appropriate directory
2. Follow the component structure:
   ```tsx
   import { ComponentProps } from 'react'
   import { cn } from '@/lib/utils'

   interface ComponentProps extends React.HTMLAttributes<HTMLDivElement> {
     // Add component-specific props
   }

   export function Component({
     className,
     children,
     ...props
   }: ComponentProps) {
     return (
       <div className={cn('base-classes', className)} {...props}>
         {children}
       </div>
     )
   }
   ```

3. Add TypeScript types for all props
4. Include proper documentation
5. Add unit tests
6. Update this documentation

### Component Testing

Each component should include:
- Unit tests
- Accessibility tests
- Visual regression tests

## Version History

- v1.0.0: Initial component library release
- v1.1.0: Added new form components
- v1.2.0: Enhanced accessibility features

## Contributing

When contributing to components:
1. Follow the established patterns
2. Add proper documentation
3. Include tests
4. Update this documentation
5. Submit a pull request 