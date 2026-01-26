# Production Deployment Checklist

Use this checklist to ensure all steps are completed before deploying to production.

## Pre-Deployment

### 1. Code Quality
- [ ] All tests passing locally (`npm run test:all`)
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] No linting errors (`npm run lint`)
- [ ] Code formatted (`npm run format`)
- [ ] Bundle size analyzed (`npm run analyze`)

### 2. Environment Setup
- [ ] Vercel account created
- [ ] Project linked to GitHub repository
- [ ] Production environment variables configured
- [ ] Preview environment variables configured

### 3. Third-Party Services

#### Sanity CMS
- [ ] Production dataset created
- [ ] API token generated with appropriate permissions
- [ ] Webhook secret generated
- [ ] Content populated (products, blog posts, certifications)
- [ ] Roles and permissions configured

#### Email (Resend)
- [ ] Resend account created
- [ ] API key generated
- [ ] Domain verified for sending
- [ ] Email templates tested
- [ ] From email configured (noreply@afrexia.com)

#### reCAPTCHA v3
- [ ] reCAPTCHA site registered
- [ ] Site key and secret key obtained
- [ ] Domain added to allowed domains
- [ ] Score threshold configured (0.5 recommended)

#### Mapbox
- [ ] Mapbox account created
- [ ] Access token generated
- [ ] Production domain added to allowed URLs
- [ ] Usage limits reviewed

#### Analytics
- [ ] Plausible Analytics site added
- [ ] Google Analytics 4 property created
- [ ] Measurement ID obtained
- [ ] Vercel Analytics enabled

#### Sentry
- [ ] Sentry project created
- [ ] DSN obtained
- [ ] Auth token generated for source maps
- [ ] Alert rules configured
- [ ] Team notifications set up

#### Vercel KV
- [ ] KV database created
- [ ] Database connected to project
- [ ] Environment variables auto-populated
- [ ] Rate limiting tested

### 4. Domain Configuration
- [ ] Custom domain purchased
- [ ] Domain added in Vercel dashboard
- [ ] DNS A record configured for apex domain
- [ ] DNS CNAME record configured for www subdomain
- [ ] DNS propagation verified (use https://dnschecker.org)
- [ ] SSL certificate provisioned (automatic via Vercel)

## Deployment

### 5. Initial Deployment
- [ ] Code pushed to main branch
- [ ] Automatic deployment triggered
- [ ] Build completed successfully
- [ ] Deployment preview checked
- [ ] Production URL accessible

### 6. Post-Deployment Verification

#### Functionality Testing
- [ ] Homepage loads correctly
- [ ] All pages accessible (Products, Solutions, Quality, etc.)
- [ ] Language switching works (FR/EN)
- [ ] Product pages display correctly
- [ ] Product galleries and lightbox work
- [ ] Mapbox maps load and are interactive
- [ ] Blog posts display correctly
- [ ] Resources page and downloads work

#### Forms Testing
- [ ] RFQ form submits successfully
- [ ] RFQ confirmation email received (customer)
- [ ] RFQ notification email received (sales team)
- [ ] Contact form submits successfully
- [ ] Contact confirmation email received
- [ ] reCAPTCHA validation working
- [ ] Rate limiting prevents spam (test with multiple submissions)

#### Performance
- [ ] Lighthouse audit run (target: 90+ mobile, 95+ desktop)
- [ ] Core Web Vitals checked (LCP < 2.5s, FID < 100ms, CLS < 0.1)
- [ ] Images loading optimized (WebP/AVIF)
- [ ] Lazy loading working for below-fold images
- [ ] Page load times acceptable on 4G connection

#### SEO
- [ ] Meta tags present on all pages
- [ ] Open Graph tags configured
- [ ] Twitter Card tags configured
- [ ] Hreflang tags for FR/EN versions
- [ ] Schema.org structured data present
- [ ] Sitemap accessible (/sitemap.xml)
- [ ] Robots.txt accessible (/robots.txt)
- [ ] Canonical URLs configured

#### Security
- [ ] HTTPS enforced (automatic via Vercel)
- [ ] Security headers present (check with securityheaders.com)
- [ ] Content Security Policy configured
- [ ] HSTS header present
- [ ] X-Frame-Options configured
- [ ] Input sanitization working
- [ ] Rate limiting active

#### Analytics & Monitoring
- [ ] Plausible Analytics tracking page views
- [ ] Google Analytics 4 tracking (with consent)
- [ ] Vercel Analytics showing data
- [ ] Sentry capturing errors (test with intentional error)
- [ ] Conversion events tracking (RFQ, contact, downloads)

### 7. Sanity Integration
- [ ] Sanity webhook configured
- [ ] Webhook secret matches environment variable
- [ ] Test content update triggers revalidation
- [ ] ISR working (content updates within 60 seconds)
- [ ] Draft mode working for content preview

### 8. Accessibility
- [ ] WCAG AA compliance verified
- [ ] Keyboard navigation tested
- [ ] Screen reader tested (NVDA/JAWS)
- [ ] Color contrast ratios meet standards
- [ ] Focus indicators visible
- [ ] ARIA labels present
- [ ] Alt text on all images

### 9. Browser & Device Testing
- [ ] Chrome (desktop & mobile)
- [ ] Firefox (desktop & mobile)
- [ ] Safari (desktop & mobile)
- [ ] Edge (desktop)
- [ ] Mobile responsive (320px to 3840px)
- [ ] Tablet layouts
- [ ] Touch interactions on mobile

## Post-Launch

### 10. Monitoring Setup
- [ ] Uptime monitoring configured (UptimeRobot, Pingdom, etc.)
- [ ] Sentry alerts configured for critical errors
- [ ] Vercel deployment notifications enabled
- [ ] Team access granted to all platforms

### 11. Documentation
- [ ] CMS documentation provided to content team
- [ ] Deployment guide reviewed
- [ ] Emergency contacts documented
- [ ] Rollback procedure documented

### 12. Backup & Recovery
- [ ] Sanity backup strategy confirmed
- [ ] Environment variables documented securely
- [ ] Rollback procedure tested
- [ ] Previous deployment available for quick rollback

### 13. Performance Baseline
- [ ] Initial Lighthouse scores recorded
- [ ] Core Web Vitals baseline established
- [ ] Traffic patterns monitored
- [ ] Error rates monitored

## Week 1 Post-Launch

### 14. Monitoring & Optimization
- [ ] Review Vercel Analytics daily
- [ ] Check Sentry for errors daily
- [ ] Monitor form submission rates
- [ ] Review user feedback
- [ ] Check email delivery rates
- [ ] Monitor page load times
- [ ] Review conversion rates

### 15. Content Updates
- [ ] Test content publishing workflow
- [ ] Verify revalidation working
- [ ] Train content team on CMS
- [ ] Document any issues

## Monthly Maintenance

### 16. Regular Tasks
- [ ] Review and update dependencies
- [ ] Check for security updates
- [ ] Review Lighthouse scores
- [ ] Analyze traffic patterns
- [ ] Review error logs
- [ ] Update content as needed
- [ ] Review and optimize images
- [ ] Check broken links

### 17. Security
- [ ] Review access logs
- [ ] Check for suspicious activity
- [ ] Update API keys if needed
- [ ] Review rate limiting effectiveness
- [ ] Check for security advisories

## Emergency Procedures

### Rollback
If critical issues are discovered:
1. Go to Vercel Dashboard → Deployments
2. Find last working deployment
3. Click "..." → "Promote to Production"
4. Verify rollback successful
5. Investigate and fix issue
6. Redeploy when ready

### Critical Error Response
1. Check Sentry for error details
2. Review Vercel logs
3. Verify environment variables
4. Check third-party service status
5. Contact support if needed

## Sign-Off

- [ ] Technical lead approval
- [ ] Stakeholder approval
- [ ] Content team trained
- [ ] Support team briefed
- [ ] Launch announcement prepared

**Deployment Date**: _______________

**Deployed By**: _______________

**Verified By**: _______________

**Notes**:
_______________________________________________
_______________________________________________
_______________________________________________
