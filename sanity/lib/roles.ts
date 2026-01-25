/**
 * Sanity Roles and Permissions Configuration
 * 
 * This file defines the role-based access control for the Sanity CMS.
 * Roles must be configured in the Sanity project settings at:
 * https://www.sanity.io/manage/project/{projectId}/api#roles
 * 
 * Role Definitions:
 * 
 * 1. Administrator
 *    - Full access to all content types
 *    - Can create, read, update, delete, and publish all documents
 *    - Can manage project settings and team members
 *    - Grant: "administrator" role in Sanity project settings
 * 
 * 2. Editor
 *    - Can create and edit all content types
 *    - Can publish blog posts and pages
 *    - Cannot publish products, certifications, or resources (requires Administrator approval)
 *    - Cannot delete documents
 *    - Grant: Custom role with these permissions:
 *      - Read: all documents
 *      - Create: all documents
 *      - Update: all documents
 *      - Publish: blogPost, blogCategory, page
 * 
 * 3. Viewer
 *    - Read-only access to all content
 *    - Cannot create, edit, or delete any documents
 *    - Grant: "viewer" role in Sanity project settings
 * 
 * Workflow States:
 * - Draft: Document is being worked on (not published)
 * - In Review: Document is ready for review (custom field)
 * - Published: Document is live on the website
 * 
 * To implement the workflow, add a "status" field to document schemas:
 * {
 *   name: 'status',
 *   title: 'Status',
 *   type: 'string',
 *   options: {
 *     list: [
 *       { title: 'Draft', value: 'draft' },
 *       { title: 'In Review', value: 'in_review' },
 *       { title: 'Published', value: 'published' }
 *     ]
 *   },
 *   initialValue: 'draft'
 * }
 */

export const ROLES = {
  ADMINISTRATOR: 'administrator',
  EDITOR: 'editor',
  VIEWER: 'viewer',
} as const

export const WORKFLOW_STATUS = {
  DRAFT: 'draft',
  IN_REVIEW: 'in_review',
  PUBLISHED: 'published',
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]
export type WorkflowStatus = (typeof WORKFLOW_STATUS)[keyof typeof WORKFLOW_STATUS]

/**
 * Document types that require Administrator approval for publication
 */
export const ADMIN_APPROVAL_REQUIRED = [
  'product',
  'certification',
  'resource',
  'teamMember',
]

/**
 * Document types that Editors can publish directly
 */
export const EDITOR_CAN_PUBLISH = [
  'blogPost',
  'blogCategory',
  'page',
]
