# Sanity CMS Roles and Permissions

This document describes how to configure roles and permissions for the Afrexia website CMS.

## Role Definitions

### 1. Administrator
**Full access to all content and settings**

- Can create, read, update, delete, and publish all documents
- Can manage project settings and team members
- Can configure webhooks and API tokens
- No restrictions on any content type

**How to assign:**
1. Go to https://www.sanity.io/manage/project/{projectId}/api#roles
2. Invite user with "Administrator" role

### 2. Editor
**Can create and edit content, limited publishing rights**

- Can create and edit all content types
- Can publish: Blog Posts, Blog Categories, Pages
- Cannot publish: Products, Certifications, Resources, Team Members (requires Administrator approval)
- Cannot delete any documents
- Cannot access project settings

**How to assign:**
1. Go to https://www.sanity.io/manage/project/{projectId}/api#roles
2. Create a custom role named "Editor" with these permissions:
   ```
   Read: all documents
   Create: all documents
   Update: all documents
   Publish: blogPost, blogCategory, page
   Delete: none
   ```

### 3. Viewer
**Read-only access**

- Can view all content in the CMS
- Cannot create, edit, delete, or publish any documents
- Useful for stakeholders who need to review content

**How to assign:**
1. Go to https://www.sanity.io/manage/project/{projectId}/api#roles
2. Invite user with "Viewer" role

## Workflow States

All document types include a `workflowStatus` field with three states:

### Draft
- Initial state when a document is created
- Document is being worked on
- Not visible on the website

### In Review
- Document is ready for review
- Editors set this status when they want Administrator approval
- Still not visible on the website

### Published
- Document is live on the website
- For Products, Certifications, Resources, and Team Members: Only Administrators can set this status
- For Blog Posts, Blog Categories, and Pages: Both Administrators and Editors can set this status

## Content Approval Workflow

### For Products, Certifications, Resources, Team Members:
1. Editor creates document (status: Draft)
2. Editor completes content and sets status to "In Review"
3. Administrator reviews content
4. Administrator either:
   - Publishes (sets status to Published)
   - Requests changes (adds comment and keeps status as In Review or changes to Draft)

### For Blog Posts, Blog Categories, Pages:
1. Editor creates document (status: Draft)
2. Editor completes content
3. Editor can directly publish (sets status to Published)
4. Administrator can review and unpublish if needed

## Setting Up Custom Roles in Sanity

1. Navigate to your Sanity project: https://www.sanity.io/manage
2. Select your project
3. Go to "API" tab
4. Scroll to "Roles" section
5. Click "Add custom role"
6. Configure permissions as described above

## Querying Published Content

When fetching content for the website, always filter by `workflowStatus`:

```typescript
// Fetch only published products
const query = `*[_type == "product" && workflowStatus == "published"]`

// Fetch only published blog posts
const query = `*[_type == "blogPost" && workflowStatus == "published"] | order(publishedAt desc)`
```

## Change Tracking

Sanity automatically tracks:
- Who created each document
- Who last modified each document
- When each change was made

This information is available in the document history panel in Sanity Studio.

## Best Practices

1. **Always use workflow status**: Never bypass the workflow status field when querying content
2. **Regular audits**: Administrators should regularly review documents in "In Review" status
3. **Clear communication**: Use Sanity's comment feature to communicate about content changes
4. **Training**: Ensure all team members understand their role's capabilities and limitations
5. **Backup**: Regularly export content as a backup (Administrators only)

## Support

For questions about roles and permissions, contact the technical administrator or refer to:
- Sanity documentation: https://www.sanity.io/docs/access-control
- Project-specific settings: https://www.sanity.io/manage/project/{projectId}
