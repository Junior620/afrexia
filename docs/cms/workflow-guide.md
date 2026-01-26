# Workflow Guide

This guide explains the content workflow process in the Afrexia CMS, from draft to publication.

## Overview

The Afrexia CMS uses a three-stage workflow to ensure content quality and maintain editorial control:

1. **Draft** → Work in progress
2. **In Review** → Ready for approval
3. **Published** → Live on website

## Workflow States

### Draft

**Purpose**: Content creation and editing

**Characteristics**:
- Not visible on website
- Can be edited freely
- Auto-saves as you work
- No approval needed to save

**Who can use**:
- All users (Administrator, Editor, Viewer)

**When to use**:
- Starting new content
- Making major revisions
- Content not ready for review

**Actions available**:
- Edit all fields
- Save changes
- Move to "In Review"
- Delete draft

### In Review

**Purpose**: Editorial review and approval

**Characteristics**:
- Not visible on website
- Awaiting approval
- Can still be edited
- Signals readiness for publication

**Who can use**:
- Editors (to submit for review)
- Administrators (to review and approve)

**When to use**:
- Content is complete
- Ready for editorial review
- Awaiting final approval

**Actions available**:
- Edit if changes needed
- Approve and publish (Administrators)
- Return to draft (if revisions needed)

### Published

**Purpose**: Live content on website

**Characteristics**:
- Visible on website
- Appears within 60 seconds (ISR)
- Can still be edited
- Tracked in analytics

**Who can use**:
- Administrators (full control)
- Editors (with approval)

**When to use**:
- Content is approved
- Ready for public viewing
- All quality checks passed

**Actions available**:
- Edit and republish
- Unpublish (remove from website)
- View on website
- Check analytics

## Workflow Process

### For Editors

#### 1. Create Draft

1. Click content type in sidebar
2. Click **"+ Create"**
3. Fill in all fields
4. Content auto-saves as "Draft"

#### 2. Complete Content

1. Write all required content
2. Add images and files
3. Fill in both languages (FR/EN)
4. Review for completeness

#### 3. Submit for Review

1. Review content one final time
2. Change **Workflow Status** to "In Review"
3. Click **"Publish"** to save status
4. Notify administrator (if needed)

#### 4. Address Feedback

If administrator requests changes:
1. Review feedback/comments
2. Make necessary edits
3. Keep status as "In Review"
4. Notify administrator when done

#### 5. Publication

Administrator will:
- Review content
- Approve and publish
- Or request further changes

### For Administrators

#### 1. Review Submissions

1. Check for content "In Review"
2. Open document to review
3. Check all fields for completeness
4. Verify quality and accuracy

#### 2. Provide Feedback

If changes needed:
1. Add comments (if available)
2. Contact editor directly
3. Keep status as "In Review"
4. Or change back to "Draft"

#### 3. Approve and Publish

If content is ready:
1. Change **Workflow Status** to "Published"
2. Click **"Publish"** button
3. Content goes live within 60 seconds via automatic revalidation
4. Notify editor (if needed)

**How automatic revalidation works**:
- Sanity webhook triggers when content is published
- Website receives notification and updates cached pages
- Changes appear on the website within 60 seconds
- No manual rebuild required

For more details, see [Sanity Webhook Setup Guide](../SANITY_WEBHOOK_SETUP.md).

#### 4. Monitor Published Content

1. Check website to verify
2. Monitor analytics
3. Address any issues
4. Schedule updates as needed

## Workflow Best Practices

### For Content Creation

**Before starting**:
- [ ] Understand the content requirements
- [ ] Gather all necessary information
- [ ] Collect images and files
- [ ] Review similar existing content

**During creation**:
- [ ] Fill in all required fields
- [ ] Complete both language versions
- [ ] Use proper formatting
- [ ] Add appropriate metadata
- [ ] Preview content regularly

**Before submitting**:
- [ ] Proofread thoroughly
- [ ] Check all links work
- [ ] Verify images display correctly
- [ ] Test file downloads
- [ ] Review SEO metadata

### For Review Process

**Reviewers should check**:
- [ ] Content accuracy
- [ ] Grammar and spelling
- [ ] Brand consistency
- [ ] SEO optimization
- [ ] Image quality
- [ ] Link functionality
- [ ] Both language versions
- [ ] Compliance with guidelines

**Common issues to catch**:
- Missing required fields
- Incomplete translations
- Poor image quality
- Broken links
- Incorrect categorization
- Missing metadata
- Formatting inconsistencies

### For Publishing

**Before publishing**:
- [ ] Final content review
- [ ] All feedback addressed
- [ ] Quality standards met
- [ ] SEO optimized
- [ ] Images optimized
- [ ] Links verified

**After publishing**:
- [ ] Verify on website
- [ ] Check both languages
- [ ] Test all functionality
- [ ] Monitor initial analytics
- [ ] Address any issues immediately

## Content Quality Standards

### Writing Standards

**Tone and Style**:
- Professional but accessible
- B2B focused
- Industry-appropriate terminology
- Active voice preferred
- Clear and concise

**Grammar and Spelling**:
- No typos or spelling errors
- Proper punctuation
- Consistent capitalization
- Correct use of industry terms

**Structure**:
- Logical organization
- Clear headings
- Short paragraphs
- Scannable content
- Proper formatting

### Technical Standards

**Images**:
- High quality (minimum 1200px width)
- Optimized file size (under 2MB)
- Proper format (JPG, PNG, WebP)
- Alt text for all images
- Relevant to content

**Files**:
- Professional formatting
- Reasonable file size (under 5MB)
- Correct format (PDF preferred)
- Up-to-date information
- No draft watermarks

**Links**:
- All links work
- Open in appropriate window
- Relevant and authoritative
- No broken links
- Proper anchor text

### SEO Standards

**Meta Tags**:
- Unique title and description
- Appropriate length (title <60, description <160)
- Include target keywords
- Compelling and accurate
- Both languages complete

**Content**:
- Original, unique content
- Appropriate keyword usage
- Natural language
- Proper heading hierarchy
- Internal and external links

## Collaboration Tips

### Communication

**Use clear communication**:
- Specify what needs to be changed
- Provide examples when possible
- Set clear deadlines
- Acknowledge receipt of feedback

**Channels**:
- Email for formal requests
- Chat for quick questions
- Comments in CMS (if available)
- Regular team meetings

### Coordination

**Avoid conflicts**:
- Communicate who's working on what
- Don't edit same document simultaneously
- Use draft status for work in progress
- Coordinate major updates

**Version control**:
- Review change history before editing
- Note major changes in comments
- Keep team informed of updates
- Maintain documentation

## Emergency Procedures

### Urgent Content Updates

If content needs immediate update:

1. **Administrator**:
   - Edit published content directly
   - Make necessary changes
   - Click "Publish" to update
   - Content updates within 60 seconds

2. **Editor**:
   - Contact administrator immediately
   - Provide specific changes needed
   - Wait for administrator to update
   - Verify changes on website

### Content Errors

If published content has errors:

1. **Identify the issue**:
   - Document the error
   - Assess severity
   - Determine urgency

2. **Take action**:
   - Minor errors: Edit and republish
   - Major errors: Unpublish immediately
   - Critical errors: Contact technical team

3. **Fix and republish**:
   - Make corrections
   - Review thoroughly
   - Republish
   - Verify fix on website

### Unpublishing Content

To remove content from website:

1. Open the published document
2. Click **"•••"** menu (top right)
3. Select **"Unpublish"**
4. Content removed from website
5. Document remains in CMS as draft

**When to unpublish**:
- Outdated information
- Errors that can't be quickly fixed
- Compliance issues
- Seasonal content out of season

## Workflow Metrics

### Track These Metrics

**Content creation**:
- Time from draft to published
- Number of revisions needed
- Approval rate
- Rejection reasons

**Content quality**:
- Error rate after publication
- User engagement metrics
- SEO performance
- Conversion rates

**Team performance**:
- Content output per editor
- Review turnaround time
- Collaboration effectiveness
- Training needs

### Continuous Improvement

**Regular reviews**:
- Monthly workflow assessment
- Quarterly process improvements
- Annual strategy review
- Ongoing training

**Optimization**:
- Streamline approval process
- Improve communication
- Update guidelines
- Enhance training

## Workflow Checklist

### For Editors

**Creating content**:
- [ ] All required fields complete
- [ ] Both languages filled in
- [ ] Images uploaded with alt text
- [ ] Files uploaded and tested
- [ ] Content proofread
- [ ] SEO metadata complete
- [ ] Status set to "In Review"

**Addressing feedback**:
- [ ] All feedback reviewed
- [ ] Changes implemented
- [ ] Content re-proofread
- [ ] Administrator notified
- [ ] Status remains "In Review"

### For Administrators

**Reviewing content**:
- [ ] Content accuracy verified
- [ ] Quality standards met
- [ ] Both languages reviewed
- [ ] SEO optimized
- [ ] Images and files checked
- [ ] Links tested
- [ ] Feedback provided (if needed)

**Publishing content**:
- [ ] Final review complete
- [ ] All issues resolved
- [ ] Status changed to "Published"
- [ ] Content published
- [ ] Website verified
- [ ] Editor notified

## Next Steps

- Review [Best Practices](./best-practices.md)
- Check [Troubleshooting](./troubleshooting.md)
- Return to [CMS Documentation Home](./README.md)
