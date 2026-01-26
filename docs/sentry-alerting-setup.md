# Sentry Alerting Configuration Guide

**Requirements: 25.3**

This guide explains how to configure Sentry alerts for critical errors in the Afrexia website.

## Overview

Sentry alerting ensures that the development and operations teams are notified immediately when critical errors occur in production. This enables rapid response to issues that could impact user experience or business operations.

## Alert Types

### 1. Critical Error Alerts

**Trigger Conditions:**
- HTTP 500 errors in API routes
- Unhandled exceptions in server components
- Email delivery failures (sales/RFQ emails)
- Database connection errors
- External service failures (Sanity, Resend, Mapbox)

**Notification Channels:**
- Email to technical team
- Slack channel: #afrexia-alerts
- PagerDuty (optional, for 24/7 coverage)

### 2. Performance Degradation Alerts

**Trigger Conditions:**
- API response time > 3 seconds
- Page load time > 5 seconds
- Error rate > 5% over 5 minutes

**Notification Channels:**
- Email to technical team
- Slack channel: #afrexia-performance

### 3. Security Alerts

**Trigger Conditions:**
- Multiple failed authentication attempts
- Suspicious rate limit violations
- CSP violations
- Webhook signature verification failures

**Notification Channels:**
- Email to security team
- Slack channel: #afrexia-security

## Configuration Steps

### Step 1: Create Alert Rules in Sentry

1. Log in to Sentry dashboard
2. Navigate to **Alerts** → **Create Alert Rule**
3. Configure the following alert rules:

#### Alert Rule 1: Critical API Errors

```yaml
Name: Critical API Errors
Environment: production
Conditions:
  - Event type: error
  - Level: error or fatal
  - Tags: 
      - errorType: api_error
      - statusCode: 500, 502, 503, 504
  - Frequency: More than 5 events in 5 minutes
Actions:
  - Send email to: tech-team@afrexia.com
  - Send Slack notification to: #afrexia-alerts
  - Severity: Critical
```

#### Alert Rule 2: Email Delivery Failures

```yaml
Name: Email Delivery Failures
Environment: production
Conditions:
  - Event type: error
  - Tags:
      - errorType: email_delivery
  - Frequency: More than 2 events in 10 minutes
Actions:
  - Send email to: tech-team@afrexia.com
  - Send Slack notification to: #afrexia-alerts
  - Severity: High
```

#### Alert Rule 3: Form Submission Errors

```yaml
Name: Form Submission Errors
Environment: production
Conditions:
  - Event type: error
  - Tags:
      - endpoint: /api/rfq, /api/contact
  - Frequency: More than 10 events in 5 minutes
Actions:
  - Send email to: tech-team@afrexia.com
  - Send Slack notification to: #afrexia-alerts
  - Severity: High
```

#### Alert Rule 4: External Service Failures

```yaml
Name: External Service Failures
Environment: production
Conditions:
  - Event type: error
  - Message contains: "External service error"
  - Frequency: More than 3 events in 5 minutes
Actions:
  - Send email to: tech-team@afrexia.com
  - Send Slack notification to: #afrexia-alerts
  - Severity: High
```

#### Alert Rule 5: High Error Rate

```yaml
Name: High Error Rate
Environment: production
Conditions:
  - Error rate: > 5% over 5 minutes
  - Minimum events: 10
Actions:
  - Send email to: tech-team@afrexia.com
  - Send Slack notification to: #afrexia-alerts
  - Severity: Critical
```

#### Alert Rule 6: Performance Degradation

```yaml
Name: Slow API Response Times
Environment: production
Conditions:
  - Transaction duration: > 3000ms (P95)
  - Frequency: More than 10 transactions in 5 minutes
Actions:
  - Send email to: tech-team@afrexia.com
  - Send Slack notification to: #afrexia-performance
  - Severity: Medium
```

#### Alert Rule 7: Security Violations

```yaml
Name: Security Violations
Environment: production
Conditions:
  - Event type: error
  - Tags:
      - errorType: security_violation
  - Frequency: More than 5 events in 5 minutes
Actions:
  - Send email to: security-team@afrexia.com
  - Send Slack notification to: #afrexia-security
  - Severity: Critical
```

### Step 2: Configure Slack Integration

1. In Sentry, navigate to **Settings** → **Integrations**
2. Find and install the **Slack** integration
3. Authorize Sentry to access your Slack workspace
4. Configure the following channels:
   - `#afrexia-alerts` - Critical errors and high-priority issues
   - `#afrexia-performance` - Performance degradation alerts
   - `#afrexia-security` - Security-related alerts

### Step 3: Configure Email Notifications

1. In Sentry, navigate to **Settings** → **Teams**
2. Add team members with their email addresses:
   - Technical team: tech-team@afrexia.com
   - Security team: security-team@afrexia.com
3. Configure notification preferences for each team member

### Step 4: Set Up PagerDuty (Optional)

For 24/7 on-call coverage:

1. In Sentry, navigate to **Settings** → **Integrations**
2. Find and install the **PagerDuty** integration
3. Connect your PagerDuty account
4. Configure escalation policies for critical alerts

### Step 5: Configure Alert Thresholds

Adjust alert thresholds based on your traffic patterns:

```javascript
// Example: Adjust thresholds in sentry.server.config.ts
Sentry.init({
  // ... other config
  
  beforeSend(event, hint) {
    // Add custom logic to filter or modify events before sending
    
    // Example: Only alert on critical errors in production
    if (process.env.NODE_ENV === 'production' && event.level === 'error') {
      // Add tags for alert routing
      event.tags = {
        ...event.tags,
        alertPriority: 'high',
      };
    }
    
    return event;
  },
});
```

## Alert Response Procedures

### Critical Errors (Severity: Critical)

1. **Immediate Response Required** (within 15 minutes)
2. Check Sentry dashboard for error details
3. Review error context and stack trace
4. Check application logs in Vercel dashboard
5. If user-impacting, post status update to status page
6. Implement fix or rollback to previous version
7. Monitor error rate after fix deployment

### High Priority Errors (Severity: High)

1. **Response Required** (within 1 hour)
2. Investigate error in Sentry dashboard
3. Determine impact on users
4. Schedule fix for next deployment
5. Document issue and resolution

### Medium Priority Errors (Severity: Medium)

1. **Response Required** (within 4 hours)
2. Review error details
3. Add to backlog for investigation
4. Monitor for increasing frequency

## Testing Alerts

To test that alerts are working correctly:

1. **Trigger a test error:**
   ```bash
   # In development, trigger a test error
   curl -X POST http://localhost:3000/api/test-error
   ```

2. **Verify alert delivery:**
   - Check email inbox
   - Check Slack channel
   - Check PagerDuty (if configured)

3. **Review alert content:**
   - Ensure error details are clear
   - Verify links to Sentry dashboard work
   - Confirm severity level is correct

## Monitoring Alert Effectiveness

Regularly review alert effectiveness:

1. **Weekly Review:**
   - Check alert frequency
   - Identify false positives
   - Adjust thresholds if needed

2. **Monthly Review:**
   - Analyze response times
   - Review alert fatigue
   - Update alert rules based on patterns

3. **Quarterly Review:**
   - Evaluate overall alerting strategy
   - Update team notification preferences
   - Review and update documentation

## Environment Variables

Ensure the following environment variables are set:

```bash
# Sentry Configuration
NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/project-id
SENTRY_AUTH_TOKEN=your-auth-token
SENTRY_ORG=your-org-name
SENTRY_PROJECT=afrexia-website
NEXT_PUBLIC_SENTRY_ENVIRONMENT=production

# Notification Endpoints (if using custom webhooks)
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
PAGERDUTY_INTEGRATION_KEY=your-pagerduty-key
```

## Troubleshooting

### Alerts Not Being Sent

1. Check Sentry project settings
2. Verify integration configurations
3. Check alert rule conditions
4. Review Sentry event stream to ensure events are being captured

### Too Many Alerts (Alert Fatigue)

1. Increase alert thresholds
2. Add more specific conditions
3. Group similar errors
4. Use Sentry's issue grouping features

### Missing Critical Alerts

1. Review alert rule conditions
2. Check if errors are being filtered by beforeSend
3. Verify environment configuration
4. Test alert rules manually

## Additional Resources

- [Sentry Alerts Documentation](https://docs.sentry.io/product/alerts/)
- [Slack Integration Guide](https://docs.sentry.io/product/integrations/notification-incidents/slack/)
- [PagerDuty Integration Guide](https://docs.sentry.io/product/integrations/notification-incidents/pagerduty/)
- [Alert Best Practices](https://docs.sentry.io/product/alerts/best-practices/)

## Support

For issues with Sentry alerting configuration:
- Contact: tech-team@afrexia.com
- Sentry Support: support@sentry.io
- Internal Documentation: [Link to internal wiki]
