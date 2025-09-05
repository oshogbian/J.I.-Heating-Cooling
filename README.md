# J.I. Heating & Cooling Website

A professional HVAC services website with automatic email notifications for form submissions.

## 🚀 Features

- **Contact Form** - General inquiries
- **Service Request Form** - HVAC service requests
- **Emergency Form** - Emergency HVAC services
- **Automatic Email Notifications** - Professional email alerts for all form submissions
- **Responsive Design** - Works on all devices
- **Professional UI** - Modern, clean design

## 🏗️ Architecture

- **Frontend**: React.js deployed on Firebase Hosting
- **Backend**: Node.js/Express deployed on Render
- **Database**: Supabase PostgreSQL
- **Email**: Gmail SMTP via Nodemailer

## 📧 Email Notification System

When forms are submitted:
1. Data is stored in Supabase
2. Database triggers automatically call the Render backend
3. Professional email notifications are sent to `jiheatandcool@gmail.com`

## 🛠️ Setup

### Frontend (Firebase Hosting)
- URL: https://jiheatingcooling.web.app
- Built with React.js and Webpack

### Backend (Render)
- URL: https://j-i-heating-cooling-2.onrender.com
- Handles email notifications via webhooks

### Database (Supabase)
- PostgreSQL database with automatic triggers
- Run `complete_database_setup.sql` to set up tables and triggers

## 📁 Project Structure

```
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/          # Page components
│   │   └── config.js       # Configuration
│   └── public/             # Static assets
├── routes/                  # Backend API routes
├── utils/                   # Backend utilities
├── app.js                   # Main backend server
└── complete_database_setup.sql  # Database setup script
```

## 🔧 Environment Variables (Render)

```
EMAIL_HOST=auto
EMAIL_PORT=587
EMAIL_USER=jiheatandcool@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
COMPANY_EMAIL=jiheatandcool@gmail.com
SUPABASE_URL=https://ljsthabxoycpgizmpavx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## 📋 Database Setup

1. Go to Supabase Dashboard → SQL Editor
2. Run the contents of `complete_database_setup.sql`
3. This creates tables, triggers, and email notification system

## 🧪 Testing

1. Visit https://jiheatingcooling.web.app
2. Submit any form
3. Check `jiheatandcool@gmail.com` for email notification
4. Check Render logs for webhook activity

## 🚀 Deployment

- **Frontend**: Automatically deployed via Firebase
- **Backend**: Automatically deployed via Render
- **Database**: Supabase cloud database

## 📞 Contact

For support or questions, contact the development team.
