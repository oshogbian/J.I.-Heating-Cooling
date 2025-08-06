# Security Guide for J.I. HVAC Website

## ⚠️ IMPORTANT: Before Pushing to Git

### 1. Environment Variables Setup

Create a `.env` file in the root directory with your actual values:

```bash
# Copy the template
cp env.example .env

# Edit with your real values
nano .env
```

### 2. Required Environment Variables

```bash
# Supabase Configuration
REACT_APP_SUPABASE_URL=https://ljsthabxoycpgizmpavx.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_actual_anon_key_here
REACT_APP_SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key_here
```

### 3. Files That Should NOT Be Committed

The following files contain sensitive information and are already in `.gitignore`:

- ✅ `test-comprehensive.js` (contains hardcoded keys)
- ✅ `create_contacts_table.js` (contains hardcoded keys)
- ✅ `test-supabase.js` (contains hardcoded keys)
- ✅ `test-email-config.js` (contains email credentials)
- ✅ `test-system.js` (contains system info)
- ✅ `.env` (contains all secrets)
- ✅ `frontend/dist/` (build output)
- ✅ `frontend/build/` (build output)

### 4. Secure Testing

Use the secure test file instead:

```bash
# Use this for testing (requires .env file)
node test-comprehensive-secure.js
```

### 5. Before Committing

1. **Check for exposed secrets:**
   ```bash
   git diff --cached | grep -i "eyJ"
   ```

2. **Verify .gitignore is working:**
   ```bash
   git status
   ```
   Make sure no sensitive files are staged.

3. **Test with secure version:**
   ```bash
   node test-comprehensive-secure.js
   ```

### 6. Security Checklist

- [ ] `.env` file exists with real values
- [ ] No hardcoded keys in committed files
- [ ] All test files with secrets are in `.gitignore`
- [ ] Build outputs are in `.gitignore`
- [ ] Secure test passes

### 7. Getting Your Supabase Keys

1. Go to https://supabase.com/dashboard/project/ljsthabxoycpgizmpavx
2. Navigate to Settings > API
3. Copy the keys:
   - **Project URL**: `https://ljsthabxoycpgizmpavx.supabase.co`
   - **anon public**: Your anon key
   - **service_role secret**: Your service role key

### 8. Safe to Commit

These files are safe to commit:
- ✅ `frontend/src/config.js` (uses environment variables)
- ✅ `complete_database_setup.sql` (no secrets)
- ✅ `create_contacts_table.sql` (no secrets)
- ✅ `env.example` (template only)
- ✅ `SECURITY.md` (this file)

### 9. Emergency: If You Accidentally Committed Secrets

If you accidentally committed secrets:

1. **Immediately rotate your Supabase keys** in the dashboard
2. **Remove the commit:**
   ```bash
   git reset --soft HEAD~1
   ```
3. **Update your .env file** with the new keys
4. **Re-commit without secrets**

### 10. Production Deployment

For production deployment:

1. Set environment variables in your hosting platform
2. Never commit `.env` files
3. Use different keys for development and production
4. Regularly rotate your keys

---

**Remember: Security is everyone's responsibility!** 