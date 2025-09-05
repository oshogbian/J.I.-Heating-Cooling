# Google Cloud Error Reporting Setup Guide

This guide explains how to set up Google Cloud Error Reporting for the J.I. Heating & Cooling website.

## Prerequisites

1. **Google Cloud Project**: You need a Google Cloud project with billing enabled
2. **Service Account**: A service account with Error Reporting permissions
3. **Environment Variables**: Configure the necessary environment variables

## Setup Steps

### 1. Create Google Cloud Project (if not exists)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Error Reporting API:
   ```bash
   gcloud services enable clouderrorreporting.googleapis.com
   ```

### 2. Create Service Account

1. Go to IAM & Admin > Service Accounts
2. Click "Create Service Account"
3. Name: `ji-hvac-error-reporting`
4. Description: `Service account for error reporting`
5. Grant the following roles:
   - Error Reporting Admin
   - Logs Writer
   - Cloud Logging Admin

### 3. Download Service Account Key

1. Click on the created service account
2. Go to "Keys" tab
3. Click "Add Key" > "Create new key"
4. Choose JSON format
5. Download the key file and save it securely

### 4. Environment Variables

Add these environment variables to your deployment environment (Render, etc.):

#### Backend Environment Variables
```bash
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json
NODE_ENV=production
```

#### Frontend Environment Variables
```bash
REACT_APP_ENABLE_ERROR_REPORTING=true
REACT_APP_API_URL=https://your-backend-url.onrender.com
```

### 5. Render Deployment Setup

For Render deployment, add the service account key as a secret:

1. Go to your Render service dashboard
2. Go to "Environment" tab
3. Add the service account JSON as a secret file
4. Set the path in `GOOGLE_APPLICATION_CREDENTIALS`

### 6. Local Development Setup

For local development, create a `.env` file in the root directory:

```bash
# Backend .env
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=./service-account-key.json
NODE_ENV=development

# Frontend .env
REACT_APP_ENABLE_ERROR_REPORTING=true
REACT_APP_API_URL=http://localhost:5050
```

## Error Reporting Features

### Backend Error Reporting
- Automatic error capture for Express routes
- Uncaught exception handling
- Unhandled promise rejection handling
- Manual error reporting with context
- Request information capture (URL, method, user agent, etc.)

### Frontend Error Reporting
- React Error Boundary integration
- Global JavaScript error handling
- Unhandled promise rejection handling
- API error reporting
- Form submission error reporting
- PDF generation error reporting

## Error Types Captured

1. **API Errors**: Network requests, authentication failures
2. **Form Errors**: Validation errors, submission failures
3. **Authentication Errors**: Login/logout issues
4. **PDF Errors**: Generation and download failures
5. **Component Errors**: React component crashes
6. **Runtime Errors**: JavaScript execution errors

## Viewing Errors

1. Go to Google Cloud Console
2. Navigate to Error Reporting
3. View error groups, trends, and details
4. Set up alerts for critical errors

## Testing Error Reporting

### Test Backend Error Reporting
```bash
# This will trigger an error that gets reported
curl -X POST http://localhost:5050/api/test-error
```

### Test Frontend Error Reporting
1. Open browser console
2. Run: `throw new Error('Test error');`
3. Check Google Cloud Error Reporting console

## Security Considerations

1. **Service Account Key**: Keep the service account key secure and never commit it to version control
2. **Error Data**: Be mindful of sensitive information in error reports
3. **Access Control**: Limit access to Error Reporting console to necessary team members

## Cost Considerations

- Error Reporting is free for the first 1 million error events per month
- Additional events cost $0.50 per million
- Log ingestion costs may apply for detailed error logs

## Troubleshooting

### Common Issues

1. **"Permission denied" errors**: Check service account permissions
2. **"Project not found" errors**: Verify project ID and billing
3. **Frontend errors not appearing**: Check API URL and CORS settings
4. **Backend errors not appearing**: Verify service account key path

### Debug Commands

```bash
# Check if Error Reporting API is enabled
gcloud services list --enabled | grep errorreporting

# Test service account permissions
gcloud auth activate-service-account --key-file=service-account-key.json

# View recent logs
gcloud logging read "resource.type=gce_instance" --limit=10
```

## Support

For issues with Google Cloud Error Reporting:
- [Google Cloud Error Reporting Documentation](https://cloud.google.com/error-reporting/docs)
- [Google Cloud Support](https://cloud.google.com/support)

For issues with this implementation:
- Check the error logs in your deployment platform
- Verify environment variable configuration
- Test with the provided test endpoints 