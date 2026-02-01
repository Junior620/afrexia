import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { NavigationProvider } from '../NavigationProvider';
import { navigationManager } from '@/lib/navigation';

// Mock the navigation manager
vi.mock('@/lib/navigation', () => ({
  navigationManager: {
    initialize: vi.fn(),
    destroy: vi.fn(),
  },
}));

describe('NavigationProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize navigation manager on mount', async () => {
    render(
      <NavigationProvider>
        <div>Test content</div>
      </NavigationProvider>
    );

    await waitFor(() => {
      expect(navigationManager.initialize).toHaveBeenCalledTimes(1);
    });
  });

  it('should destroy navigation manager on unmount', async () => {
    const { unmount } = render(
      <NavigationProvider>
        <div>Test content</div>
      </NavigationProvider>
    );

    unmount();

    await waitFor(() => {
      expect(navigationManager.destroy).toHaveBeenCalledTimes(1);
    });
  });

  it('should not initialize when enabled is false', async () => {
    render(
      <NavigationProvider enabled={false}>
        <div>Test content</div>
      </NavigationProvider>
    );

    await waitFor(() => {
      expect(navigationManager.initialize).not.toHaveBeenCalled();
    });
  });

  it('should render children', () => {
    const { getByText } = render(
      <NavigationProvider>
        <div>Test content</div>
      </NavigationProvider>
    );

    expect(getByText('Test content')).toBeInTheDocument();
  });
});
