# Team Page - Hierarchy Update

## Changes Applied

### 1. Schema Update - Added `level` Field
**File:** `sanity/schemas/teamMember.ts`

Added new field to distinguish leadership from team members:
```typescript
{
  name: 'level',
  title: 'Level',
  type: 'string',
  options: {
    list: [
      { title: 'Leadership (CEO, Co-Founder)', value: 'leadership' },
      { title: 'Team (Employee)', value: 'team' },
    ],
  },
  initialValue: 'team',
}
```

### 2. Visual Hierarchy

#### Leadership Section (CEOs)
- **Layout**: 2 columns, centered (max-width: 4xl)
- **Photo aspect ratio**: 3:4 (smaller than before)
- **Photo size**: 500x667px
- **Card padding**: p-6
- **Text size**: text-xl (name), text-sm (position)
- **Icon size**: w-4 h-4
- **Shows**: Mini-bio (2 lines)
- **Background**: Default dark

#### Team Section (Employees)
- **Layout**: 4 columns on desktop, 3 on tablet, 1 on mobile
- **Photo aspect ratio**: 1:1 (square, much smaller)
- **Photo size**: 400x400px
- **Card padding**: p-4 (compact)
- **Text size**: text-base (name), text-xs (position)
- **Icon size**: w-3.5 h-3.5 (smaller)
- **No bio**: Space-efficient
- **Background**: Subtle bg-[#0F1814]/30

### 3. Size Comparison

| Element | Leadership | Team |
|---------|-----------|------|
| Photo aspect | 3:4 | 1:1 |
| Photo width | 500px | 400px |
| Card padding | 24px | 16px |
| Name size | 20px | 16px |
| Position size | 14px | 12px |
| Icon size | 16px | 14px |
| Columns | 2 | 4 |
| Bio | Yes (2 lines) | No |

### 4. How to Use in Sanity

When adding/editing team members:

1. **For CEOs/Co-Founders:**
   - Set `Level` = "Leadership (CEO, Co-Founder)"
   - Set `Display Order` = 1, 2 (for sorting)
   - Add full bio (will show 2 lines preview)

2. **For Employees:**
   - Set `Level` = "Team (Employee)" (default)
   - Set `Display Order` = 3, 4, 5... (for sorting)
   - Bio optional (won't show on card)

### 5. Responsive Behavior

**Leadership:**
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 2 columns (centered)

**Team:**
- Mobile: 1 column
- Tablet: 3 columns
- Desktop: 4 columns

### 6. Visual Separation

- Leadership section has default background
- Team section has subtle background tint: `bg-[#0F1814]/30`
- Clear visual hierarchy with size difference
- Separate section titles: "Direction" / "Notre Équipe"

## Migration Notes

**Existing team members:**
- Will default to `level: 'team'`
- Need to manually update CEOs to `level: 'leadership'` in Sanity

**Steps:**
1. Go to Sanity Studio
2. Open each CEO team member
3. Set Level = "Leadership (CEO, Co-Founder)"
4. Save and publish

## Benefits

✅ Clear visual hierarchy (leadership vs team)
✅ Smaller, more manageable card sizes
✅ Better use of space (4 columns for team)
✅ Professional appearance
✅ Scalable for growing team
✅ Maintains premium dark green design
