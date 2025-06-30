# Agency Finance - Deployment Guide

## 🚀 Secure Production Deployment

### Prerequisites
1. **Supabase Project**: Create a new project at [supabase.com](https://supabase.com)
2. **Domain**: Your subdomain ready (e.g., `finance.youragency.com`)
3. **Hosting**: Netlify, Vercel, or similar

### 1. Supabase Setup

#### A. Create Authentication Tables
```sql
-- Enable RLS on auth.users (already enabled by default)

-- Create user profiles table
CREATE TABLE public.user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  company_name TEXT,
  role TEXT DEFAULT 'agency_owner',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own profile" 
  ON public.user_profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.user_profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name, company_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'company_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

#### B. Configure Authentication
1. Go to Authentication → Settings
2. **Site URL**: `https://your-subdomain.yourdomain.com`
3. **Redirect URLs**: Add your domain
4. **Email Templates**: Customize if needed
5. **Security**: Enable email confirmations (recommended)

#### C. Configure Security
1. **RLS**: Ensure Row Level Security is enabled
2. **API Keys**: Use anon key for client
3. **JWT Settings**: Default settings are secure

### 2. Environment Variables

Create `.env` file:
```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_APP_ENV=production
VITE_APP_DOMAIN=your-subdomain.yourdomain.com
```

### 3. Build & Deploy

#### Option A: Netlify (Recommended)
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in site settings
5. Enable form submissions (if needed)
6. Configure custom domain

#### Option B: Vercel
1. Import GitHub repository
2. Framework preset: Vite
3. Add environment variables
4. Configure custom domain

#### Option C: Manual Deployment
```bash
# Build for production
npm run build

# Upload dist/ folder to your hosting provider
```

### 4. Domain Configuration

#### A. DNS Setup
```
Type: CNAME
Name: finance (or your subdomain)
Value: your-netlify-site.netlify.app
TTL: 3600
```

#### B. SSL Certificate
- Netlify/Vercel: Automatic with Let's Encrypt
- Custom hosting: Configure SSL certificate

### 5. Security Checklist

#### ✅ Authentication Security
- [x] Strong password requirements (8+ chars, mixed case, numbers)
- [x] Email verification enabled
- [x] Session timeout configured
- [x] Rate limiting on login attempts
- [x] Secure password reset flow

#### ✅ Data Security
- [x] Row Level Security (RLS) enabled
- [x] Input sanitization
- [x] XSS protection headers
- [x] CSRF protection
- [x] Content Security Policy

#### ✅ Infrastructure Security
- [x] HTTPS enforced
- [x] Security headers configured
- [x] Environment variables secured
- [x] Database access restricted
- [x] API keys properly scoped

#### ✅ Privacy & Compliance
- [x] Data encryption at rest
- [x] Data encryption in transit
- [x] User data isolation
- [x] Right to be forgotten (delete account)
- [x] Minimal data collection

### 6. Monitoring & Maintenance

#### A. Supabase Dashboard
- Monitor database performance
- Check authentication metrics
- Review security logs

#### B. Application Monitoring
```javascript
// Add to your app for error tracking
window.addEventListener('error', (event) => {
  // Log to your monitoring service
  console.error('App Error:', event.error);
});
```

#### C. Backup Strategy
- Supabase: Automatic daily backups
- User data: Export functionality built-in
- Regular security updates

### 7. User Onboarding

#### A. Admin Account
1. First user becomes admin automatically
2. Can invite team members
3. Manage company settings

#### B. Security Training
- Strong password guidelines
- Two-factor authentication (future feature)
- Regular security reviews

### 8. Scaling Considerations

#### A. Database
- Supabase scales automatically
- Monitor connection limits
- Optimize queries as data grows

#### B. Performance
- CDN for static assets
- Image optimization
- Code splitting already configured

### 9. Backup & Recovery

#### A. Data Export
```javascript
// Built-in export functionality
const exportData = () => {
  const dataStr = JSON.stringify(state, null, 2);
  // Download as JSON file
};
```

#### B. Disaster Recovery
- Supabase: Point-in-time recovery
- Code: GitHub repository backup
- Configs: Document all settings

### 10. Legal Considerations

#### A. Privacy Policy
- Data collection practices
- User rights (GDPR compliance)
- Contact information

#### B. Terms of Service
- Usage restrictions
- Liability limitations
- Data retention policies

## 🔐 Security Features Implemented

### Authentication
- ✅ Secure email/password authentication
- ✅ Password strength requirements
- ✅ Email verification
- ✅ Secure password reset
- ✅ Session management
- ✅ Rate limiting

### Data Protection
- ✅ Row Level Security (RLS)
- ✅ Input sanitization
- ✅ XSS protection
- ✅ CSRF protection
- ✅ SQL injection prevention

### Infrastructure
- ✅ HTTPS only
- ✅ Security headers
- ✅ Content Security Policy
- ✅ Environment variable protection
- ✅ Database access controls

## 🚀 Go Live Checklist

- [ ] Supabase project configured
- [ ] Authentication tables created
- [ ] Environment variables set
- [ ] Domain configured with SSL
- [ ] Security headers enabled
- [ ] Error monitoring setup
- [ ] Backup strategy implemented
- [ ] User documentation created
- [ ] Security audit completed
- [ ] Performance testing done

## 📞 Support

For deployment assistance:
1. Check Supabase documentation
2. Review hosting provider docs
3. Test in staging environment first
4. Monitor logs during initial rollout

**Security Note**: Never commit `.env` files or expose API keys. Always use environment variables in production.