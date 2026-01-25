import { afterEach, beforeAll, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import React, { forwardRef } from 'react';

// Set up test environment variables
process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = 'test-project-id';
process.env.NEXT_PUBLIC_SANITY_DATASET = 'test-dataset';
process.env.NEXT_PUBLIC_SANITY_API_VERSION = '2024-01-24';

// Mock react-map-gl at module level
vi.mock('react-map-gl', () => ({
  Map: forwardRef((props: any, ref: any) => {
    // Expose fitBounds and flyTo methods on ref immediately
    React.useEffect(() => {
      if (ref && typeof ref === 'object') {
        ref.current = {
          fitBounds: vi.fn(),
          flyTo: vi.fn(),
          getMap: vi.fn(() => ({
            on: vi.fn(),
            off: vi.fn(),
          })),
        };
      }
    });
    return React.createElement('div', { 'data-testid': 'mock-map' }, props.children);
  }),
  Marker: ({ children, onClick }: any) =>
    React.createElement('div', { 'data-testid': 'mock-marker', onClick }, children),
  NavigationControl: () => React.createElement('div', { 'data-testid': 'mock-navigation-control' }),
  Popup: ({ children, onClose }: any) =>
    React.createElement(
      'div',
      { 'data-testid': 'mock-popup' },
      React.createElement('button', { onClick: onClose }, 'Close'),
      children
    ),
}));

// Mock matchMedia for GSAP and animation tests
beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  // Mock requestAnimationFrame for GSAP - use real implementation
  let rafId = 0;
  global.requestAnimationFrame = (cb: FrameRequestCallback) => {
    const id = ++rafId;
    setTimeout(() => cb(performance.now()), 0);
    return id;
  };

  global.cancelAnimationFrame = (_id: number) => {
    // No-op for tests
  };
});

// Cleanup after each test
afterEach(() => {
  cleanup();
});
