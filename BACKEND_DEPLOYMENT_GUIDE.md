# Backend Deployment Guide - J.I. Heating & Cooling

This guide will help you deploy your existing backend with email notifications to a hosting platform.

## 🚀 Quick Deployment Options

### Option 1: Render.com (Recommended - Free Tier Available)

1. **Go to [render.com](https://render.com)** and sign up
2. **Click "New +" → "Web Service"**
3. **Connect your GitHub repository**
4. **Configure the service:**

   - **Name**: `ji-heating-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Root Directory**: Leave empty (uses root)

5. **Set Environment Variables:**

   ```
   REACT_APP_SUPABASE_URL=https://ljsthabxoycpgizmpavx.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxqc3RoYWJ4b3ljcGdpem1wYXZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMjY2ODUsImV4cCI6MjA2ODkwMjY4NX0.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8
   REACT_APP_SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxqc3RoYWJ4b3ljcGdpem1wYXZ4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzMyNjY4NSwiZXhwIjoyMDY4OTAyNjg1fQ.lFc_Zw631ki369yfucku2OZF0pcZ4RzyozImaXcnDOo
   PORT=5050
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=sam@jiheatingandcooling.org
   EMAIL_PASSWORD=YOUR_GMAIL_APP_PASSWORD
   COMPANY_EMAIL=sam@jiheatingandcooling.org
   GOOGLE_CLOUD_PROJECT_ID=jiheatingcooling
   ```

6. **Deploy!** Render will automatically deploy your backend

### Option 2: Railway.app (Free Tier Available)

1. **Go to [railway.app](https://railway.app)** and sign up
2. **Click "New Project" → "Deploy from GitHub repo"**
3. **Select your repository**
4. **Set Environment Variables** (same as above)
5. **Deploy!**

### Option 3: Vercel (Free Tier Available)

1. **Go to [vercel.com](https://vercel.com)** and sign up
2. **Import your GitHub repository**
3. **Configure:**

   - **Framework Preset**: Other
   - **Root Directory**: Leave empty
   - **Build Command**: `npm install`
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install`
   - **Development Command**: `npm start`

4. **Set Environment Variables** (same as above)
5. **Deploy!**

## 📧 Email Configuration

### Gmail Setup (Recommended)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password:**
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
   - Use this password in `EMAIL_PASSWORD`

### Alternative Email Providers

If you prefer a different email provider, update these variables:

```env
EMAIL_HOST=your-smtp-host.com
EMAIL_PORT=587
EMAIL_USER=your-email@yourdomain.com
EMAIL_PASSWORD=your-email-password
```

## 🔧 Backend Routes

Your backend already has these email-enabled routes:

- **POST** `/api/contact` - Contact form submissions
- **POST** `/api/services` - Service request submissions
- **POST** `/api/emergency` - Emergency request submissions

## 🧪 Testing

1. **Deploy your backend** using one of the options above
2. **Get your backend URL** (e.g., `https://ji-heating-backend.onrender.com`)
3. **Update your frontend** to use the backend URL instead of direct Supabase calls
4. **Test form submissions** on your website
5. **Check your email** for notifications

## 🔄 Frontend Integration

After deploying your backend, you need to update your frontend to use the backend instead of direct Supabase calls.

### Update Contact Form

In `/frontend/src/components/ContactForm.js`, change the fetch URL:

```javascript
// Change from:
const res = await fetch(`${config.SUPABASE_URL}/rest/v1/contacts`, {

// To:
const res = await fetch(`${config.API_URL}/api/contact`, {
```

### Update Emergency Form

In `/frontend/src/pages/Emergency.js`, change the fetch URL:

```javascript
// Change from:
const res = await fetch(`${config.SUPABASE_URL}/rest/v1/emergency_requests`, {

// To:
const res = await fetch(`${config.API_URL}/api/emergency`, {
```

### Update Services Form

In `/frontend/src/pages/Services.js`, change the fetch URL:

```javascript
// Change from:
const res = await fetch(`${config.SUPABASE_URL}/rest/v1/service_requests`, {

// To:
const res = await fetch(`${config.API_URL}/api/services`, {
```

## 📊 Monitoring

- **Render**: Check logs in the Render dashboard
- **Railway**: Check logs in the Railway dashboard
- **Vercel**: Check logs in the Vercel dashboard

## 🚨 Troubleshooting

### Email Not Sending

- Check your Gmail App Password
- Verify SMTP settings
- Check backend logs for errors

### Backend Not Starting

- Check environment variables are set correctly
- Verify all dependencies are installed
- Check the logs for specific error messages

### Forms Not Submitting

- Verify backend URL is correct
- Check CORS settings
- Ensure backend is running and accessible

## 🎯 Next Steps

1. **Deploy backend** using one of the options above
2. **Set up Gmail App Password**
3. **Update frontend** to use backend URLs
4. **Test all forms**
5. **Monitor email notifications**

Your backend is already configured with professional email templates and error handling. Once deployed, you'll receive formatted email notifications for all form submissions!
