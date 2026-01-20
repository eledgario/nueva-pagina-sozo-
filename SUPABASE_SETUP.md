# Supabase Setup Guide for SOZO Landing

This guide explains how to set up Supabase for the Project Configurator feature.

## Prerequisites

- A Supabase account (sign up at https://supabase.com)
- Node.js and npm installed

## Step 1: Create a Supabase Project

1. Go to https://app.supabase.com
2. Click "New Project"
3. Fill in your project details:
   - Project Name: `sozo-landing` (or your preferred name)
   - Database Password: Choose a strong password
   - Region: Select the closest region to your users
4. Click "Create new project" and wait for it to initialize (~2 minutes)

## Step 2: Get Your API Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (under "Project URL")
   - **anon/public key** (under "Project API keys")

## Step 3: Configure Environment Variables

1. Open the `.env.local` file in your project root
2. Replace the placeholder values with your actual credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Important:** Never commit `.env.local` to git. It's already in `.gitignore`.

## Step 4: Set Up the Database

1. In your Supabase dashboard, go to **SQL Editor**
2. Open the `supabase-schema.sql` file from your project root
3. Copy all the SQL code
4. Paste it into the SQL Editor
5. Click "Run" to execute the SQL

This will create:
- The `orders` table with all necessary columns
- The `logos` storage bucket
- Security policies for file uploads

## Step 5: Verify the Setup

### Check the Table

1. Go to **Table Editor** in Supabase
2. You should see the `orders` table with these columns:
   - `id` (UUID, primary key)
   - `created_at` (timestamp)
   - `name` (text)
   - `company` (text)
   - `whatsapp` (text)
   - `comments` (text)
   - `flow` (text)
   - `details` (jsonb)
   - `quantity` (integer)
   - `logo_url` (text)
   - `logo_filename` (text)
   - `status` (text)

### Check Storage

1. Go to **Storage** in Supabase
2. You should see the `logos` bucket
3. The bucket should be set to **Public**

## Step 6: Test the Integration

1. Restart your dev server:
   ```bash
   npm run dev
   ```

2. Navigate to the Project Configurator section on your landing page
3. Complete the form:
   - Choose a flow (Individual, Kits, or Custom)
   - Select products
   - Upload a logo (max 10MB)
   - Fill in contact information
4. Click "ENVIAR PROPUESTA"
5. You should see confetti and a success message!

## Step 7: View Submitted Orders

### In Supabase Dashboard

1. Go to **Table Editor** → **orders**
2. You'll see all submitted orders with their details

### Query Example

```sql
SELECT
  id,
  created_at,
  name,
  company,
  whatsapp,
  flow,
  details,
  status
FROM orders
ORDER BY created_at DESC;
```

## File Upload Details

### How It Works

1. When a user uploads a logo, it's stored in the `logos` bucket
2. A unique filename is generated: `{timestamp}-{random}.{extension}`
3. The file is uploaded to Supabase Storage
4. A public URL is generated and saved in the database

### Storage Policies

The setup includes two policies:
- **Allow public uploads**: Anyone can upload files to the `logos` bucket
- **Allow public reads**: Anyone can view files from the `logos` bucket

### File Size Limit

- Maximum file size: **10MB**
- Accepted formats: PNG, JPG, PDF

## Order Details Structure

The `details` column stores JSONB data that varies by flow type:

### Individual Product

```json
{
  "type": "individual",
  "product": "hoodie",
  "quantity": 10
}
```

### Pre-made Kit

```json
{
  "type": "kit",
  "kitId": "starter",
  "kitName": "Starter Kit",
  "items": ["Hoodie", "Box"],
  "quantity": 10
}
```

### Custom (Build Your Own)

```json
{
  "type": "custom",
  "products": ["hoodie", "tumbler", "stand"],
  "quantity": 10
}
```

## Error Handling

The app handles several error scenarios:

1. **Supabase not configured**: Shows error message before attempting submission
2. **File too large**: Validates file size before upload
3. **Upload failed**: Shows specific error message
4. **Database insert failed**: Shows error and allows retry
5. **Network errors**: Catches and displays generic error message

## Success Flow

When an order is successfully submitted:

1. ✅ Logo is uploaded to Supabase Storage
2. ✅ Public URL is generated
3. ✅ Order data is inserted into database
4. 🎉 Confetti animation plays
5. ✓ Success message displays
6. 📱 User sees "We'll contact you via WhatsApp in <24h"

## Security Considerations

### Current Setup (Development)

- Public uploads are enabled
- No authentication required
- Suitable for landing page lead generation

### Production Recommendations

1. **Rate Limiting**: Add rate limiting to prevent spam
2. **File Validation**: Server-side validation of file types
3. **Duplicate Detection**: Check for duplicate submissions
4. **Email Notifications**: Send confirmation emails
5. **Admin Dashboard**: Build an admin panel to manage orders

## Troubleshooting

### "Invalid supabaseUrl" Error

- Check that you've set the environment variables in `.env.local`
- Restart your dev server after changing env vars
- Make sure the URL starts with `https://`

### "Error al subir logo"

- Verify the `logos` bucket exists
- Check that public upload policy is enabled
- Ensure file is under 10MB

### "Error al guardar orden"

- Verify the `orders` table exists
- Check that all required columns are present
- Review the SQL schema and re-run if needed

### Orders Not Appearing

1. Go to Supabase Dashboard → Table Editor → orders
2. Check for any entries
3. Try submitting a test order
4. Check browser console for errors

## Next Steps

### Enhance the Feature

1. **Email Notifications**: Use Supabase Edge Functions to send emails
2. **Real-time Updates**: Use Supabase Realtime for live order status
3. **Admin Dashboard**: Build a dashboard to manage orders
4. **Analytics**: Track conversion rates and popular products

### Example Admin Query

```sql
-- Get order stats
SELECT
  flow,
  COUNT(*) as total_orders,
  AVG(quantity) as avg_quantity
FROM orders
GROUP BY flow
ORDER BY total_orders DESC;
```

## Support

If you run into issues:
1. Check the browser console for errors
2. Review Supabase logs (Dashboard → Logs)
3. Verify environment variables are set correctly
4. Ensure SQL schema was executed successfully

---

**Built with:**
- Next.js 16.1.1
- Supabase (Database + Storage)
- TypeScript
- Framer Motion
- Canvas Confetti
