# Cloudflare R2 Film Storage Integration

## Overview

This integration provides Cloudflare R2 storage support for admin film uploads to the marketplace. It replaces the default Supabase storage implementation with Cloudflare R2, offering better performance and scalability.

## Environment Variables

Add these variables to your `.env` file:

```env
# Cloudflare R2 Configuration
VITE_CLOUDFLARE_ACCOUNT_ID="6aad6ca3e754de1841fca91e7a084717"
VITE_CLOUDFLARE_R2_BUCKET="afdfilms"
VITE_CLOUDFLARE_R2_PUBLIC_URL="https://pub-177906b238494a1c881c07e85377027b.r2.dev"
VITE_CLOUDFLARE_R2_ACCESS_KEY_ID="your-access-key-id"
VITE_CLOUDFLARE_R2_SECRET_ACCESS_KEY="your-secret-access-key"
```

## How to Get Credentials

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/6aad6ca3e754de1841fca91e7a084717/r2/default/buckets/afdfilms/settings)
2. Navigate to R2 > Overview > Manage R2 API Tokens
3. Create a new API token with "Object Read & Write" permissions
4. Copy the Access Key ID and Secret Access Key
5. Paste them into your `.env` file

## Usage

The integration is automatically used by the `AdminFilmUpload` component for film and poster uploads.

### Key Features:

- ✅ Cloudflare R2 integration for film storage
- ✅ Public URL generation for uploaded files
- ✅ Fallback to mock implementation if credentials are missing
- ✅ File validation (type, size)
- ✅ Progress tracking

### Files Modified:

1. `src/components/admin/AdminFilmUpload.tsx` - Updated to use R2 instead of Supabase storage
2. `src/integrations/cloudflare-r2/client.ts` - Cloudflare R2 client implementation
3. `.env` - Added Cloudflare R2 configuration

## Architecture

The integration uses AWS SDK v3 with Cloudflare R2's S3-compatible API. This allows us to leverage the well-maintained AWS SDK while using Cloudflare R2 as the storage backend.

## Testing

You can test the integration using the test functions in `src/integrations/cloudflare-r2/test-r2.ts`.

## Notes

- The integration currently provides a mock implementation if credentials are not provided (will log warning but continue)
- For production use, make sure to provide valid Cloudflare R2 credentials
- The bucket `afdfilms` must be configured for public access in Cloudflare R2 settings
