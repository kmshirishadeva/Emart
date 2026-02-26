# Email Setup Guide (Resend)

## Quick Setup

### 1. Create Resend Account
1. Go to https://resend.com
2. Sign up for a free account
3. Verify your email

### 2. Get API Key
1. Go to https://resend.com/api-keys
2. Click "Create API Key"
3. Give it a name (e.g., "QuickDrop Production")
4. Copy the API key

### 3. Add to .env File
Add this line to your `.env` file:

```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
```

### 4. Restart Dev Server
```bash
npm run dev
```

## Email Configuration

### Default Sender
The app uses `onboarding@resend.dev` by default (Resend's test domain).

### To Use Your Own Domain
1. Go to Resend Dashboard → Domains
2. Add your domain
3. Verify DNS records
4. Update `lib/email-service.ts`:
   ```typescript
   from: 'QuickDrop <noreply@yourdomain.com>',
   ```

## Testing

### Development Mode
- If `RESEND_API_KEY` is not set, emails are logged to console
- OTP is still returned in API response for testing

### Production Mode
- Real emails are sent via Resend
- OTP is NOT returned in API response

## Free Tier Limits
- Resend free tier: 3,000 emails/month
- Perfect for development and small projects

## Alternative Email Services

If you prefer other services, update `lib/email-service.ts`:

### SendGrid
```bash
npm install @sendgrid/mail
```

### AWS SES
```bash
npm install @aws-sdk/client-ses
```

### Nodemailer (SMTP)
```bash
npm install nodemailer
```

