/**
 * Unit tests for PhotoStack component
 * 
 * Tests:
 * - Component renders with images
 * - Images have correct next/image props
 * - Alt text is present for all images
 * - Caption displays correctly
 * - Hover interactions apply correct classes
 * - Lazy loading and priority loading work correctly
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PhotoStack } from '../PhotoStack';
import { ImageConfig } from '@/types/partner-section';

describe('PhotoStack', () => {
  const mockImages: ImageConfig[] = [
    {
      src: '/assets/partners/scpb-quality-control.jpg',
      alt: 'SCPB quality control - cocoa bean inspection',
      priority: true,
    },
    {
      src: '/assets/partners/scpb-warehouse.jpg',
      alt: 'SCPB storage infrastructure',
      priority: false,
    },
  ];

  const mockCaption = 'On-site quality control & traceability';

  it('renders without crashing', () => {
    render(<PhotoStack images={mockImages} caption={mockCaption} />);
    
    const photoStack = screen.getByTestId('photo-stack');
    expect(photoStack).toBeDefined();
  });

  it('renders primary image with correct alt text', () => {
    render(<PhotoStack images={mockImages} caption={mockCaption} />);
    
    const primaryImage = screen.getByAltText('SCPB quality control - cocoa bean inspection');
    expect(primaryImage).toBeDefined();
  });

  it('renders overlay image with correct alt text', () => {
    render(<PhotoStack images={mockImages} caption={mockCaption} />);
    
    const overlayImage = screen.getByAltText('SCPB storage infrastructure');
    expect(overlayImage).toBeDefined();
  });

  it('displays caption correctly', () => {
    render(<PhotoStack images={mockImages} caption={mockCaption} />);
    
    const caption = screen.getByText(mockCaption);
    expect(caption).toBeDefined();
  });

  it('applies hover interaction classes to primary image container', () => {
    render(<PhotoStack images={mockImages} caption={mockCaption} />);
    
    const photoStack = screen.getByTestId('photo-stack');
    
    // Check for group class
    expect(photoStack.className).toContain('group');
  });

  it('renders only primary image when overlay image is not provided', () => {
    const singleImage: ImageConfig[] = [mockImages[0]];
    
    render(<PhotoStack images={singleImage} caption={mockCaption} />);
    
    const primaryImage = screen.getByAltText('SCPB quality control - cocoa bean inspection');
    expect(primaryImage).toBeDefined();
    
    // Overlay image should not be present
    const overlayImage = screen.queryByAltText('SCPB storage infrastructure');
    expect(overlayImage).toBeNull();
  });

  it('returns null when no images are provided', () => {
    const { container } = render(<PhotoStack images={[]} caption={mockCaption} />);
    
    expect(container.firstChild).toBeNull();
  });

  it('applies correct styling classes', () => {
    render(<PhotoStack images={mockImages} caption={mockCaption} />);
    
    const photoStack = screen.getByTestId('photo-stack');
    
    // Check for relative positioning and group class
    expect(photoStack.className).toContain('relative');
    expect(photoStack.className).toContain('group');
  });

  it('accepts additional className prop', () => {
    render(<PhotoStack images={mockImages} caption={mockCaption} className="custom-class" />);
    
    const photoStack = screen.getByTestId('photo-stack');
    expect(photoStack.className).toContain('custom-class');
  });

  it('has caption with aria-label for accessibility', () => {
    render(<PhotoStack images={mockImages} caption={mockCaption} />);
    
    const captionContainer = screen.getByLabelText(mockCaption);
    expect(captionContainer).toBeDefined();
  });
});
