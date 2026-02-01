/**
 * Typography System Example Component
 * 
 * Demonstrates the responsive typography system with all heading levels,
 * body text, and utility classes.
 * 
 * Requirements: 2.1, 2.2, 2.3, 2.5, 2.6, 2.7 from responsive-intelligent-navigation/requirements.md
 */

import React from 'react';

export default function TypographyExample() {
  return (
    <div className="container py-12 space-y-12">
      {/* Heading Hierarchy */}
      <section className="space-y-6">
        <div className="mb-8">
          <h2 className="text-h2 mb-2">Typography System</h2>
          <p className="text-base text-muted-foreground">
            Responsive typography with fluid scaling from mobile to desktop
          </p>
        </div>

        {/* Default HTML Elements */}
        <div className="space-y-4">
          <h3 className="text-h3 mb-4">Default HTML Elements</h3>
          
          <div className="space-y-3 border-l-4 border-primary pl-6">
            <h1>Heading 1 - Main Page Title (32px → 48px)</h1>
            <h2>Heading 2 - Section Title (24px → 36px)</h2>
            <h3>Heading 3 - Subsection Title (20px → 28px)</h3>
            <h4>Heading 4 - Component Title (18px → 24px)</h4>
            <h5>Heading 5 - Small Title (16px → 20px)</h5>
            <h6>Heading 6 - Smallest Title (14px → 16px)</h6>
            <p>Body text - Paragraph content (14px → 16px)</p>
            <small>Small text - Fine print (minimum 14px)</small>
          </div>
        </div>

        {/* Tailwind Classes */}
        <div className="space-y-4">
          <h3 className="text-h3 mb-4">Tailwind Typography Classes</h3>
          
          <div className="space-y-3 border-l-4 border-secondary pl-6">
            <div className="text-h1">text-h1 - Largest heading</div>
            <div className="text-h2">text-h2 - Large heading</div>
            <div className="text-h3">text-h3 - Medium heading</div>
            <div className="text-h4">text-h4 - Small heading</div>
            <div className="text-h5">text-h5 - Smaller heading</div>
            <div className="text-h6">text-h6 - Smallest heading</div>
            <div className="text-base">text-base - Body text</div>
            <div className="text-sm">text-sm - Small text (min 14px)</div>
          </div>
        </div>

        {/* Utility Classes */}
        <div className="space-y-4">
          <h3 className="text-h3 mb-4">Utility Classes</h3>
          
          <div className="space-y-3 border-l-4 border-accent pl-6">
            <div className="text-fluid-h1">text-fluid-h1 - Fluid heading 1</div>
            <div className="text-fluid-h2">text-fluid-h2 - Fluid heading 2</div>
            <div className="text-fluid-h3">text-fluid-h3 - Fluid heading 3</div>
            <div className="text-fluid-base">text-fluid-base - Fluid body text</div>
            <div className="text-min-14">text-min-14 - Minimum 14px text</div>
          </div>
        </div>
      </section>

      {/* Line Heights */}
      <section className="space-y-6">
        <h3 className="text-h3 mb-4">Line Heights</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="border border-border rounded-lg p-6">
            <h4 className="text-h4 mb-3">Body Text (1.5)</h4>
            <p className="leading-body">
              This paragraph demonstrates body text line height of 1.5. 
              This spacing ensures comfortable reading and good readability 
              across all viewport sizes. The generous line height prevents 
              text from feeling cramped and improves comprehension.
            </p>
          </div>
          
          <div className="border border-border rounded-lg p-6">
            <h4 className="text-h4 mb-3 leading-heading">Heading Text (1.2)</h4>
            <div className="leading-heading">
              <p className="text-h5">This text uses heading line height of 1.2.</p>
              <p className="text-h5">Tighter spacing works well for headings.</p>
              <p className="text-h5">It creates visual hierarchy and impact.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Letter Spacing */}
      <section className="space-y-6">
        <h3 className="text-h3 mb-4">Letter Spacing</h3>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="border border-border rounded-lg p-6">
            <h4 className="text-h4 mb-3">Mobile (-0.02em)</h4>
            <div className="text-h3 tracking-heading-mobile">
              Heading Text
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Slightly tighter spacing for mobile screens
            </p>
          </div>
          
          <div className="border border-border rounded-lg p-6">
            <h4 className="text-h4 mb-3">Desktop (-0.03em)</h4>
            <div className="text-h3 tracking-heading-desktop">
              Heading Text
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Tighter spacing for larger screens
            </p>
          </div>
          
          <div className="border border-border rounded-lg p-6">
            <h4 className="text-h4 mb-3">Fluid (clamp)</h4>
            <div className="text-h3 tracking-heading-fluid">
              Heading Text
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Smoothly scales between breakpoints
            </p>
          </div>
        </div>
      </section>

      {/* Font Loading */}
      <section className="space-y-6">
        <h3 className="text-h3 mb-4">Font Loading Strategy</h3>
        
        <div className="border border-border rounded-lg p-6">
          <h4 className="text-h4 mb-3">font-display: swap</h4>
          <div className="space-y-3">
            <p className="leading-body">
              All fonts use <code className="bg-muted px-2 py-1 rounded">font-display: swap</code> 
              to prevent FOIT (Flash of Invisible Text) and minimize CLS (Cumulative Layout Shift).
            </p>
            <p className="leading-body">
              <strong>Font Stack:</strong> Satoshi → system-ui → sans-serif
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Text is immediately visible using fallback font</li>
              <li>Custom font swaps in quickly when loaded</li>
              <li>No layout shift or invisible text period</li>
              <li>Better user experience and Core Web Vitals</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Accessibility */}
      <section className="space-y-6">
        <h3 className="text-h3 mb-4">Accessibility Features</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="border border-border rounded-lg p-6">
            <h4 className="text-h4 mb-3">Minimum Text Size</h4>
            <p className="leading-body mb-3">
              All text enforces a minimum size of 14px to ensure readability:
            </p>
            <div className="space-y-2">
              <div className="text-sm">text-sm: minimum 14px</div>
              <div className="text-xs">text-xs: minimum 14px</div>
              <small>small element: minimum 14px</small>
            </div>
          </div>
          
          <div className="border border-border rounded-lg p-6">
            <h4 className="text-h4 mb-3">Zoom Support</h4>
            <p className="leading-body">
              Typography uses relative units (rem, em) to support user zoom settings. 
              The system maintains readability at 200% zoom and never prevents browser zoom.
            </p>
          </div>
        </div>
      </section>

      {/* Responsive Behavior */}
      <section className="space-y-6">
        <h3 className="text-h3 mb-4">Responsive Behavior</h3>
        
        <div className="border border-border rounded-lg p-6">
          <h4 className="text-h4 mb-3">Fluid Scaling with clamp()</h4>
          <p className="leading-body mb-4">
            Typography scales smoothly between mobile and desktop using CSS clamp():
          </p>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-4">Element</th>
                  <th className="text-left py-2 px-4">Mobile (320px)</th>
                  <th className="text-left py-2 px-4">Desktop (1920px)</th>
                  <th className="text-left py-2 px-4">Scaling</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="py-2 px-4">Body</td>
                  <td className="py-2 px-4">14px</td>
                  <td className="py-2 px-4">16px</td>
                  <td className="py-2 px-4">+14%</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2 px-4">H1</td>
                  <td className="py-2 px-4">32px</td>
                  <td className="py-2 px-4">48px</td>
                  <td className="py-2 px-4">+50%</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2 px-4">H2</td>
                  <td className="py-2 px-4">24px</td>
                  <td className="py-2 px-4">36px</td>
                  <td className="py-2 px-4">+50%</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2 px-4">H3</td>
                  <td className="py-2 px-4">20px</td>
                  <td className="py-2 px-4">28px</td>
                  <td className="py-2 px-4">+40%</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2 px-4">H4</td>
                  <td className="py-2 px-4">18px</td>
                  <td className="py-2 px-4">24px</td>
                  <td className="py-2 px-4">+33%</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2 px-4">H5</td>
                  <td className="py-2 px-4">16px</td>
                  <td className="py-2 px-4">20px</td>
                  <td className="py-2 px-4">+25%</td>
                </tr>
                <tr>
                  <td className="py-2 px-4">H6</td>
                  <td className="py-2 px-4">14px</td>
                  <td className="py-2 px-4">16px</td>
                  <td className="py-2 px-4">+14%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Usage Examples */}
      <section className="space-y-6">
        <h3 className="text-h3 mb-4">Usage Examples</h3>
        
        <div className="space-y-6">
          <div className="border border-border rounded-lg p-6">
            <h4 className="text-h4 mb-3">Basic Page Structure</h4>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`<div className="container">
  <h1>Main Page Heading</h1>
  <p className="text-base">
    Body text that scales from 14px to 16px.
  </p>
  
  <h2>Section Heading</h2>
  <p className="leading-body">
    More body text with explicit line height.
  </p>
</div>`}
            </pre>
          </div>
          
          <div className="border border-border rounded-lg p-6">
            <h4 className="text-h4 mb-3">Custom Typography</h4>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`<div>
  {/* Use fluid typography classes */}
  <div className="text-fluid-h2 tracking-heading-fluid">
    Custom Heading
  </div>
  
  {/* Enforce minimum size */}
  <span className="text-min-14">
    Always at least 14px
  </span>
</div>`}
            </pre>
          </div>
        </div>
      </section>
    </div>
  );
}
