# Deploying Django Portfolio to Vercel

## Prerequisites

1. A Vercel account (sign up at vercel.com)
2. Your Django portfolio project ready
3. Git repository (GitHub, GitLab, or Bitbucket)

## Step-by-Step Deployment

### 1. Update Environment Variables

In your Vercel project settings, add these environment variables:

- `DEBUG`: Set to `False` for production
- `SECRET_KEY`: Generate a new secret key for production (use Django's `get_random_secret_key()`)

### 2. Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# For production deployment
vercel --prod
```

### 3. Deploy via GitHub Integration

1. Push your code to GitHub
2. Go to vercel.com and import your repository
3. Vercel will automatically detect the `vercel.json` configuration
4. Add environment variables in project settings
5. Deploy

## Important Notes

### Static Files

Vercel will automatically serve static files from the `static/` directory. Make sure:
- All your images are in `static/portfolio/images/`
- CSS and JS files are in `static/portfolio/css/` and `static/portfolio/js/`

### Database

SQLite databases don't work well on Vercel (read-only filesystem). For production:
- Use a cloud database (PostgreSQL, MySQL) via services like:
  - Vercel Postgres
  - Supabase
  - Railway
  - PlanetScale

### Environment Variables

Set these in Vercel Dashboard → Settings → Environment Variables:

```
DEBUG=False
SECRET_KEY=your-production-secret-key-here
```

### Troubleshooting

**404 Errors:**
- Check that `vercel.json` is in the root directory
- Verify `api/index.py` exists
- Check Vercel build logs for errors

**Static Files Not Loading:**
- Ensure static files are in `static/` directory
- Check that `STATIC_URL` is set correctly in settings.py
- Verify file paths in templates use `{% raw %}{% load static %}{% endraw %}`

**Import Errors:**
- Make sure `requirements.txt` includes all dependencies
- Check Python version compatibility (Vercel uses Python 3.9 by default)

## Alternative: Static Site Generation

If you only need to display static content, consider:
1. Using `django-static-site-generator` to export static HTML
2. Deploying the static files directly to Vercel
3. This eliminates serverless function costs

## Support

For issues:
- Check Vercel build logs
- Review Django error logs
- Verify all file paths are correct
- Ensure environment variables are set

