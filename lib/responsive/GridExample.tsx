/**
 * Grid System Example Component
 * 
 * Demonstrates usage of the responsive grid system.
 * This file serves as documentation and can be used for testing.
 * 
 * Requirements: 17.1, 17.2, 17.3, 17.4, 17.5 from responsive-intelligent-navigation/requirements.md
 */

import React from 'react';

/**
 * Example 1: Basic Responsive Grid
 * Automatically adjusts columns and gaps based on breakpoint
 */
export function BasicGridExample() {
  return (
    <div className="grid grid-cols-4 gap-4 sm:grid-cols-8 sm:gap-6 md:grid-cols-12 md:gap-8">
      <div className="col-span-4 sm:col-span-8 md:col-span-12 bg-primary/10 p-4 rounded">
        Full width at all breakpoints
      </div>
      <div className="col-span-4 sm:col-span-4 md:col-span-6 bg-secondary/10 p-4 rounded">
        Full on mobile, half on tablet and desktop
      </div>
      <div className="col-span-4 sm:col-span-4 md:col-span-6 bg-secondary/10 p-4 rounded">
        Full on mobile, half on tablet and desktop
      </div>
    </div>
  );
}

/**
 * Example 2: Card Grid (1-2-3 pattern)
 * Common pattern for product cards or content cards
 */
export function CardGridExample() {
  const cards = Array.from({ length: 6 }, (_, i) => ({
    id: i + 1,
    title: `Card ${i + 1}`,
  }));

  return (
    <div className="grid grid-cols-4 gap-4 sm:grid-cols-8 sm:gap-6 md:grid-cols-12 md:gap-8">
      {cards.map((card) => (
        <div
          key={card.id}
          className="col-span-4 sm:col-span-4 md:col-span-4 bg-card p-6 rounded-lg shadow"
        >
          <h3 className="text-lg font-semibold">{card.title}</h3>
          <p className="text-muted-foreground mt-2">
            This card spans 4 columns on mobile (full width), 4 columns on tablet (half width),
            and 4 columns on desktop (third width).
          </p>
        </div>
      ))}
    </div>
  );
}

/**
 * Example 3: Sidebar Layout
 * Sidebar + main content pattern
 */
export function SidebarLayoutExample() {
  return (
    <div className="grid grid-cols-4 gap-4 sm:grid-cols-8 sm:gap-6 md:grid-cols-12 md:gap-8">
      {/* Sidebar - full width on mobile, full on tablet, 1/4 on desktop */}
      <aside className="col-span-4 sm:col-span-8 md:col-span-3 bg-muted p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Sidebar</h2>
        <nav>
          <ul className="space-y-2">
            <li>Navigation Item 1</li>
            <li>Navigation Item 2</li>
            <li>Navigation Item 3</li>
          </ul>
        </nav>
      </aside>

      {/* Main content - full width on mobile, full on tablet, 3/4 on desktop */}
      <main className="col-span-4 sm:col-span-8 md:col-span-9 bg-card p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Main Content</h1>
        <p className="text-muted-foreground">
          This layout stacks vertically on mobile and tablet, then switches to a sidebar layout
          on desktop with a 3:9 column ratio.
        </p>
      </main>
    </div>
  );
}

/**
 * Example 4: Hero Section
 * Image + text side by side on desktop
 */
export function HeroGridExample() {
  return (
    <div className="grid grid-cols-4 gap-4 sm:grid-cols-8 sm:gap-6 md:grid-cols-12 md:gap-8 items-center">
      {/* Text content */}
      <div className="col-span-4 sm:col-span-8 md:col-span-6">
        <h1 className="text-4xl font-bold mb-4">Hero Title</h1>
        <p className="text-lg text-muted-foreground mb-6">
          This hero section stacks vertically on mobile and tablet, then displays side-by-side
          on desktop with equal width columns.
        </p>
        <button className="bg-primary text-primary-foreground px-6 py-3 rounded-lg">
          Call to Action
        </button>
      </div>

      {/* Image */}
      <div className="col-span-4 sm:col-span-8 md:col-span-6">
        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
          <span className="text-muted-foreground">Hero Image</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Example 5: Complex Layout
 * Demonstrates various column spans
 */
export function ComplexGridExample() {
  return (
    <div className="grid grid-cols-4 gap-4 sm:grid-cols-8 sm:gap-6 md:grid-cols-12 md:gap-8">
      {/* Header - full width */}
      <header className="col-span-4 sm:col-span-8 md:col-span-12 bg-primary text-primary-foreground p-6 rounded-lg">
        <h1 className="text-2xl font-bold">Page Header</h1>
      </header>

      {/* Featured content - 2/3 width on desktop */}
      <div className="col-span-4 sm:col-span-8 md:col-span-8 bg-card p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Featured Content</h2>
        <p className="text-muted-foreground">
          This section takes up 8 of 12 columns on desktop (2/3 width).
        </p>
      </div>

      {/* Sidebar - 1/3 width on desktop */}
      <aside className="col-span-4 sm:col-span-8 md:col-span-4 bg-muted p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Sidebar</h3>
        <p className="text-sm text-muted-foreground">
          This sidebar takes up 4 of 12 columns on desktop (1/3 width).
        </p>
      </aside>

      {/* Three equal columns on desktop */}
      <div className="col-span-4 sm:col-span-4 md:col-span-4 bg-secondary/10 p-4 rounded-lg">
        <h4 className="font-semibold">Column 1</h4>
      </div>
      <div className="col-span-4 sm:col-span-4 md:col-span-4 bg-secondary/10 p-4 rounded-lg">
        <h4 className="font-semibold">Column 2</h4>
      </div>
      <div className="col-span-4 sm:col-span-8 md:col-span-4 bg-secondary/10 p-4 rounded-lg">
        <h4 className="font-semibold">Column 3</h4>
      </div>

      {/* Footer - full width */}
      <footer className="col-span-4 sm:col-span-8 md:col-span-12 bg-muted p-6 rounded-lg text-center">
        <p className="text-sm text-muted-foreground">Page Footer</p>
      </footer>
    </div>
  );
}

/**
 * Example 6: Using CSS Custom Properties
 * Demonstrates using the grid-responsive class with CSS variables
 */
export function CSSVariablesExample() {
  return (
    <div className="grid-responsive grid-cols-mobile sm:grid-cols-tablet md:grid-cols-desktop">
      <div className="col-span-4 sm:col-span-8 md:col-span-12 bg-accent/10 p-4 rounded">
        This grid uses CSS custom properties for gaps (--grid-gap)
      </div>
    </div>
  );
}

/**
 * All Examples Component
 * Renders all examples with spacing
 */
export function AllGridExamples() {
  return (
    <div className="container mx-auto py-12 space-y-12">
      <section>
        <h2 className="text-2xl font-bold mb-6">Basic Responsive Grid</h2>
        <BasicGridExample />
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Card Grid (1-2-3 Pattern)</h2>
        <CardGridExample />
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Sidebar Layout</h2>
        <SidebarLayoutExample />
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Hero Section</h2>
        <HeroGridExample />
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Complex Layout</h2>
        <ComplexGridExample />
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">CSS Variables Example</h2>
        <CSSVariablesExample />
      </section>
    </div>
  );
}
