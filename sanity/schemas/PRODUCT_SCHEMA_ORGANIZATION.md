# Product Schema Organization

## Overview
The product schema has been reorganized with **fieldsets** to reduce scrolling fatigue and improve the content editing experience in Sanity Studio.

## Fieldset Structure

### 1. **Basic Information** (Always Open)
- Product Name (5 languages)
- Slug (5 languages)
- Subtitle (5 languages)
- Category
- Hero Image

### 2. **Availability & Status** (Open by default)
- Availability Status
- Workflow Status
- EUDR Ready
- QA Documentation Available

### 3. **Logistics & Trade Terms** (Collapsed)
- Minimum Order Quantity (MOQ)
- Available Incoterms
- Packaging
- Grade
- Lead Time
- Harvest Season

### 4. **Quality & Compliance** (Collapsed)
- Certifications
- Available Documents (COA, Spec Sheet, Chain of Custody)
- QA Metrics
- HS Code
- Specification PDF

### 5. **Origin & Traceability** (Collapsed)
- Origin Countries
- Origin Regions (with coordinates)

### 6. **Content & Media** (Collapsed)
- Description (5 languages, rich text)
- Image Gallery
- Additional Notes

### 7. **Advanced Options** (Collapsed)
- Tags
- Target Markets
- Packaging Options (detailed)

### 8. **SEO & Metadata** (Collapsed)
- Meta Title (5 languages)
- Meta Description (5 languages)

## Benefits

✅ **Reduced Scrolling**: Fields are grouped logically and most are collapsed by default
✅ **Better UX**: Editors can focus on one section at a time
✅ **Logical Grouping**: Related fields are together (e.g., all logistics fields in one place)
✅ **Quick Access**: Most important fields (Basic Info, Status) are visible immediately
✅ **No Data Loss**: All existing fields remain unchanged, only organization improved

## Usage in Sanity Studio

When editing a product:
1. Basic Information and Availability & Status are visible immediately
2. Click any fieldset header to expand/collapse that section
3. All fields work exactly as before - no functionality changes
4. The schema maintains full backward compatibility

## Technical Implementation

- Used Sanity's `fieldsets` property to define groups
- Added `fieldset: 'groupName'` to each field definition
- Set `collapsible: false` for Basic Information (always visible)
- Set `collapsed: false` for Availability & Status (open by default)
- Set `collapsed: true` for all other sections (collapsed by default)
