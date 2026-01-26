# Troubleshooting Guide

This guide helps you resolve common issues when using the Afrexia CMS.

## Quick Troubleshooting Steps

Before diving into specific issues, try these general steps:

1. **Refresh the page**: Press Ctrl+R (Windows) or Cmd+R (Mac)
2. **Clear browser cache**: Ctrl+Shift+Delete (Windows) or Cmd+Shift+Delete (Mac)
3. **Try a different browser**: Test in Chrome, Firefox, or Safari
4. **Check your internet connection**: Ensure stable connection
5. **Log out and log back in**: Sometimes fixes authentication issues

If the issue persists, see specific problems below.

## Login and Access Issues

### Cannot Log In

**Symptoms**:
- Login page doesn't load
- Credentials rejected
- Error message on login

**Possible causes and solutions**:

1. **Incorrect credentials**
   - Double-check email and password
   - Check for typos
   - Ensure Caps Lock is off
   - Try password reset if needed

2. **Account not activated**
   - Check email for invitation
   - Click activation link
   - Contact administrator if no invitation received

3. **Browser issues**
   - Clear browser cache and cookies
   - Try incognito/private mode
   - Try different browser
   - Disable browser extensions

4. **Network issues**
   - Check internet connection
   - Try different network
   - Disable VPN if active
   - Contact IT if on corporate network

### Session Expired

**Symptoms**:
- Logged out unexpectedly
- "Session expired" message
- Need to log in again

**Solutions**:
- Log in again
- Enable "Remember me" option
- Check browser cookie settings
- Ensure cookies are enabled

### Access Denied

**Symptoms**:
- Cannot access certain content
- "Permission denied" message
- Missing menu items

**Solutions**:
- Check your user role (Administrator, Editor, Viewer)
- Contact administrator to verify permissions
- Ensure you're logged in with correct account
- Some features may be role-restricted

## Content Creation Issues

### Cannot Create New Document

**Symptoms**:
- "Create" button not working
- Error when creating document
- Document doesn't save

**Solutions**:

1. **Check permissions**
   - Verify you have Editor or Administrator role
   - Contact administrator if needed

2. **Browser issues**
   - Refresh the page
   - Clear cache
   - Try different browser

3. **Network issues**
   - Check internet connection
   - Wait and try again
   - Save work locally if possible

### Fields Not Saving

**Symptoms**:
- Changes disappear
- "Saved" indicator doesn't appear
- Content reverts to previous version

**Solutions**:

1. **Wait for auto-save**
   - Look for "Saving..." indicator
   - Wait for "Saved" confirmation
   - Don't close tab immediately after editing

2. **Check required fields**
   - Ensure all required fields are filled
   - Look for red error indicators
   - Complete missing information

3. **Network issues**
   - Check internet connection
   - Try manual save (Ctrl+S / Cmd+S)
   - Copy content to clipboard as backup

### Cannot Generate Slug

**Symptoms**:
- "Generate" button doesn't work
- Slug field remains empty
- Error when generating slug

**Solutions**:

1. **Fill in source field first**
   - Slug generates from title/name
   - Enter title before generating slug
   - Ensure title is not empty

2. **Manual entry**
   - Type slug manually
   - Use lowercase letters
   - Use hyphens instead of spaces
   - Example: `my-product-name`

3. **Slug already exists**
   - Try different slug
   - Add number or modifier
   - Check existing documents

## Image and File Upload Issues

### Image Won't Upload

**Symptoms**:
- Upload fails
- Error message
- Image doesn't appear

**Possible causes and solutions**:

1. **File too large**
   - Maximum size: 10MB
   - Compress image before uploading
   - Use tools like TinyPNG or ImageOptim
   - Resize to appropriate dimensions

2. **Unsupported format**
   - Use JPG, PNG, or WebP
   - Convert other formats
   - Avoid TIFF, BMP, or RAW files

3. **Network issues**
   - Check internet connection
   - Try again with stable connection
   - Upload smaller file first to test

4. **Browser issues**
   - Try different browser
   - Clear cache
   - Disable browser extensions

### File Upload Fails

**Symptoms**:
- PDF or document won't upload
- Upload progress stops
- Error message

**Solutions**:

1. **Check file size**
   - Maximum: 10MB
   - Compress large files
   - Split into multiple files if needed

2. **Check file format**
   - Supported: PDF, DOC, DOCX, XLS, XLSX
   - Convert unsupported formats
   - Ensure file is not corrupted

3. **Try again**
   - Cancel and retry upload
   - Refresh page and try again
   - Try different file

### Image Appears Distorted

**Symptoms**:
- Image stretched or squashed
- Poor quality
- Wrong aspect ratio

**Solutions**:

1. **Use correct dimensions**
   - Minimum 1200px width
   - Maintain aspect ratio
   - Don't upscale small images

2. **Re-upload**
   - Delete distorted image
   - Prepare image properly
   - Upload again

3. **Check hotspot**
   - Adjust hotspot/crop
   - Center on important area
   - Preview before saving

## Publishing Issues

### Content Not Appearing on Website

**Symptoms**:
- Published content not visible
- Changes don't show up
- Old version still showing

**Solutions**:

1. **Check workflow status**
   - Ensure status is "Published"
   - Not "Draft" or "In Review"
   - Click "Publish" button

2. **Wait for ISR**
   - Content updates within 60 seconds
   - Wait a minute and refresh
   - Clear browser cache

3. **Check required fields**
   - Ensure all required fields filled
   - Look for validation errors
   - Complete missing information

4. **Verify on website**
   - Check correct URL
   - Try incognito mode
   - Clear browser cache
   - Try different browser

### Cannot Publish

**Symptoms**:
- "Publish" button disabled
- Error when publishing
- Validation errors

**Solutions**:

1. **Complete required fields**
   - Look for red error indicators
   - Fill in all required fields
   - Check both language versions

2. **Check permissions**
   - Verify you have publish rights
   - Editors may need approval
   - Contact administrator

3. **Fix validation errors**
   - Read error messages
   - Correct invalid data
   - Ensure proper formats

### Published Content Shows Errors

**Symptoms**:
- Broken layout on website
- Missing images
- Broken links

**Solutions**:

1. **Immediate action**
   - Unpublish if critical
   - Fix errors in CMS
   - Republish

2. **Check content**
   - Verify all images uploaded
   - Test all links
   - Check formatting

3. **Preview before publishing**
   - Use preview feature
   - Check both languages
   - Test on mobile

## Search and Navigation Issues

### Cannot Find Document

**Symptoms**:
- Document not in list
- Search returns no results
- Missing from sidebar

**Solutions**:

1. **Use search**
   - Try different keywords
   - Search by title or slug
   - Check spelling

2. **Check filters**
   - Clear any active filters
   - Check all workflow statuses
   - Look in correct content type

3. **Check if deleted**
   - Contact administrator
   - Check if unpublished
   - May need to recreate

### Search Not Working

**Symptoms**:
- Search returns no results
- Search bar not responding
- Incorrect results

**Solutions**:

1. **Refresh page**
   - Reload the page
   - Clear cache
   - Try again

2. **Try different terms**
   - Use different keywords
   - Try partial matches
   - Check spelling

3. **Browse manually**
   - Scroll through list
   - Use filters
   - Sort by date

## Reference and Relationship Issues

### Cannot Select Reference

**Symptoms**:
- Reference field empty
- Cannot find document to reference
- "Select" button not working

**Solutions**:

1. **Create referenced document first**
   - Example: Create certification before linking to product
   - Publish referenced document
   - Then create referencing document

2. **Check if published**
   - Referenced document must be published
   - Or at least saved as draft
   - Cannot reference deleted documents

3. **Search properly**
   - Use search in reference field
   - Try different keywords
   - Check spelling

### Broken References

**Symptoms**:
- Reference shows as broken
- Referenced content missing
- Error in reference field

**Solutions**:

1. **Check if deleted**
   - Referenced document may be deleted
   - Remove broken reference
   - Select different document

2. **Republish**
   - Republish referencing document
   - May fix broken link
   - Check on website

## Multilingual Issues

### Language Switcher Not Working

**Symptoms**:
- Cannot switch between languages
- Wrong page after switching
- Returns to homepage

**Solutions**:

1. **Check Translation ID**
   - Ensure i18nId is set
   - Must be same for FR and EN versions
   - Use consistent format

2. **Check both versions exist**
   - Create both FR and EN versions
   - Publish both versions
   - Use same Translation ID

3. **Check slugs**
   - Ensure slugs are generated
   - Both languages need slugs
   - Slugs must be unique per language

### Missing Translation

**Symptoms**:
- Content only in one language
- Empty fields in other language
- Incomplete translation

**Solutions**:

1. **Fill in both languages**
   - Complete all multilingual fields
   - Check FR and EN versions
   - Don't leave fields empty

2. **Check field structure**
   - Some fields have FR/EN sub-fields
   - Expand to see both
   - Fill in each separately

## Performance Issues

### CMS Running Slow

**Symptoms**:
- Pages load slowly
- Lag when typing
- Delayed responses

**Solutions**:

1. **Check internet connection**
   - Test connection speed
   - Try different network
   - Contact IT if needed

2. **Browser optimization**
   - Close unnecessary tabs
   - Clear cache and cookies
   - Restart browser
   - Update browser

3. **Reduce load**
   - Work on one document at a time
   - Close unused documents
   - Avoid large file uploads

### Upload Taking Too Long

**Symptoms**:
- Upload progress very slow
- Upload seems stuck
- Timeout errors

**Solutions**:

1. **Check file size**
   - Compress large files
   - Optimize images
   - Split large documents

2. **Check connection**
   - Test internet speed
   - Use wired connection if possible
   - Avoid peak hours

3. **Try again**
   - Cancel and retry
   - Try smaller file first
   - Upload during off-peak hours

## Error Messages

### "Validation Error"

**Meaning**: Required field missing or invalid data

**Solutions**:
- Check for red error indicators
- Fill in all required fields
- Ensure correct data format
- Read specific error message

### "Network Error"

**Meaning**: Connection to server lost

**Solutions**:
- Check internet connection
- Refresh page
- Try again
- Contact IT if persists

### "Permission Denied"

**Meaning**: Insufficient access rights

**Solutions**:
- Check your user role
- Contact administrator
- May need different permissions
- Verify logged in with correct account

### "Document Not Found"

**Meaning**: Referenced document doesn't exist

**Solutions**:
- Document may be deleted
- Check document ID
- Create document if needed
- Remove broken reference

### "Slug Already Exists"

**Meaning**: Another document has same slug

**Solutions**:
- Use different slug
- Add modifier or number
- Check existing documents
- Delete duplicate if appropriate

## Getting Additional Help

### Before Contacting Support

Gather this information:

1. **What you were trying to do**
   - Specific action
   - Expected result
   - Actual result

2. **Error messages**
   - Exact error text
   - Screenshot if possible
   - When it occurred

3. **Your environment**
   - Browser and version
   - Operating system
   - Internet connection type
   - User role

4. **Steps to reproduce**
   - What you did before error
   - Can you reproduce it?
   - Does it happen every time?

### Contact Information

**Technical Support**:
- Email: [technical team email]
- Response time: Within 24 hours
- Urgent issues: [phone number]

**CMS Administrator**:
- Email: [admin email]
- For permissions and access issues
- Content-related questions

**Sanity Support**:
- Documentation: https://www.sanity.io/docs
- Community: https://www.sanity.io/community
- Support: https://www.sanity.io/support

### Emergency Procedures

**Critical issues** (site down, major errors):
1. Contact technical team immediately
2. Document the issue
3. Don't make additional changes
4. Wait for instructions

**Urgent content updates**:
1. Contact administrator
2. Provide specific changes needed
3. Administrator can make immediate updates
4. Verify changes on website

## Prevention Tips

### Avoid Common Issues

**Before starting work**:
- [ ] Check internet connection
- [ ] Use supported browser
- [ ] Clear cache if needed
- [ ] Ensure sufficient time

**While working**:
- [ ] Save frequently (auto-saves, but be aware)
- [ ] Fill required fields first
- [ ] Test uploads with small files first
- [ ] Preview before publishing

**Before publishing**:
- [ ] Complete all required fields
- [ ] Check both languages
- [ ] Test all links and files
- [ ] Preview content
- [ ] Verify workflow status

### Regular Maintenance

**Weekly**:
- Clear browser cache
- Update browser
- Check for CMS updates

**Monthly**:
- Review and update content
- Check for broken links
- Verify all images load
- Test all functionality

## Next Steps

- Return to [CMS Documentation Home](./README.md)
- Review [Best Practices](./best-practices.md)
- Check [Workflow Guide](./workflow-guide.md)
