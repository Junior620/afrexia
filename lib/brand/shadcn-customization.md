# shadcn/ui Component Customization Guide

This document provides guidelines for customizing shadcn/ui components to match the Afrexia brand.

## Brand Integration

All shadcn/ui components should use the brand colors and design tokens defined in:
- `lib/brand/colors.ts` - Brand color palette
- `lib/brand/design-tokens.ts` - Design system tokens
- `app/globals.css` - CSS custom properties
- `tailwind.config.ts` - Tailwind configuration

## CSS Custom Properties

The following CSS custom properties are configured in `app/globals.css` and map to brand colors:

```css
--primary: 142 45% 13%;        /* #194424 - Primary green */
--secondary: 142 45% 35%;      /* #337A49 - Secondary green */
--accent: 45 40% 29%;          /* #655E2C - Accent gold */
--success: 142 45% 35%;        /* Secondary green */
--warning: 45 40% 29%;         /* Accent gold */
--info: 100 20% 52%;           /* #80996F - Support green */
--muted: 80 20% 92%;           /* #E9EBE5 - Light */
--border: 80 20% 70%;          /* #B0BCA4 - Neutral */
```

## Component Styling Guidelines

### Buttons

When adding shadcn/ui Button component, customize it to use brand colors:

```tsx
// components/ui/button.tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:bg-primary-dark",
        secondary: "bg-white text-primary border-2 border-primary hover:bg-light",
        ghost: "text-primary hover:bg-light",
        destructive: "bg-destructive text-white hover:bg-destructive/90",
        success: "bg-success text-white hover:bg-success-dark",
      },
      size: {
        default: "px-6 py-3",
        sm: "px-4 py-2 text-sm",
        lg: "px-8 py-4 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
```

### Cards

```tsx
// components/ui/card.tsx
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-xl bg-white shadow-md hover:shadow-xl transition-shadow border border-neutral",
        className
      )}
      {...props}
    />
  )
);
```

### Inputs

```tsx
// components/ui/input.tsx
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-lg border border-neutral bg-white px-3 py-2",
          "text-foreground placeholder:text-muted-foreground",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
```

### Badges

```tsx
// components/ui/badge.tsx
const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary text-white",
        secondary: "bg-secondary text-white",
        success: "bg-success-light text-success-dark",
        warning: "bg-warning-light text-warning-dark",
        info: "bg-info-light text-info-dark",
        destructive: "bg-destructive/10 text-destructive",
        outline: "border border-primary text-primary bg-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);
```

### Dialogs/Modals

```tsx
// components/ui/dialog.tsx
const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  ({ className, children, ...props }, ref) => (
    <DialogPortal>
      <DialogOverlay className="fixed inset-0 z-50 bg-black/50" />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%]",
          "w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl",
          "border border-neutral",
          className
        )}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
);
```

### Alerts

```tsx
// components/ui/alert.tsx
const alertVariants = cva(
  "relative w-full rounded-lg border p-4",
  {
    variants: {
      variant: {
        default: "bg-white border-neutral text-foreground",
        success: "bg-success-light border-success text-success-dark",
        warning: "bg-warning-light border-warning text-warning-dark",
        info: "bg-info-light border-info text-info-dark",
        destructive: "bg-destructive/10 border-destructive text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);
```

### Tabs

```tsx
// components/ui/tabs.tsx
const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, ...props }, ref) => (
    <TabsPrimitive.List
      ref={ref}
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-lg bg-muted p-1",
        className
      )}
      {...props}
    />
  )
);

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, ...props }, ref) => (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5",
        "text-sm font-medium transition-all",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        "disabled:pointer-events-none disabled:opacity-50",
        "data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
```

## Color Usage Rules

1. **Primary Actions**: Use `bg-primary` for main CTAs and important actions
2. **Secondary Actions**: Use `bg-white` with `border-primary` for secondary actions
3. **Success States**: Use `bg-success-light` with `text-success-dark` for success messages
4. **Warning States**: Use `bg-warning-light` with `text-warning-dark` for warnings
5. **Error States**: Use `bg-destructive/10` with `text-destructive` for errors
6. **Info States**: Use `bg-info-light` with `text-info-dark` for informational messages
7. **Muted/Disabled**: Use `bg-muted` with `text-muted-foreground` for disabled or muted states

## Border Radius

- Cards and containers: `rounded-xl` (12px)
- Buttons and inputs: `rounded-lg` (8px)
- Badges and pills: `rounded-full`
- Small elements: `rounded-md` (6px)

## Shadows

- Cards at rest: `shadow-md`
- Cards on hover: `shadow-xl`
- Elevated cards: `shadow-lg`
- Modals and popovers: `shadow-2xl`

## Focus States

All interactive elements should have visible focus indicators:

```css
focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
```

## Transitions

Use consistent transition durations:

```css
transition-colors    /* For color changes */
transition-shadow    /* For shadow changes */
transition-all       /* For multiple properties */
```

## Accessibility

- Maintain minimum contrast ratios (4.5:1 for normal text, 3:1 for large text)
- Ensure touch targets are at least 44x44px
- Provide visible focus indicators
- Use semantic HTML and ARIA labels where appropriate

## Installation Command

When installing shadcn/ui components, use:

```bash
npx shadcn@latest add [component-name]
```

Then customize the generated component according to these guidelines.

## Example: Adding a Button Component

1. Install the component:
   ```bash
   npx shadcn@latest add button
   ```

2. Customize `components/ui/button.tsx` to use brand colors:
   - Replace default colors with brand colors
   - Update hover states to use brand color variants
   - Ensure focus states use primary color

3. Test the component in different states:
   - Default
   - Hover
   - Focus
   - Disabled
   - Loading (if applicable)

4. Verify accessibility:
   - Check color contrast
   - Test keyboard navigation
   - Verify screen reader compatibility
