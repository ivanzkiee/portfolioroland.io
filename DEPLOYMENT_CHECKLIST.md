# Vercel Deployment Checklist

## Before Deploying

### 1. Environment Variables (REQUIRED)
Set these in Vercel Dashboard → Settings → Environment Variables:

- **SECRET_KEY**: Generate a secure key
  ```python
  # Run this locally to generate:
  python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
  ```

- **DEBUG**: Set to `False` for production

### 2. Verify Files Exist
- [ ] `api/index.py` exists
- [ ] `api/__init__.py` exists  
- [ ] `vercel.json` exists
- [ ] `requirements.txt` exists with Django listed
- [ ] `portfolio_project/settings.py` has correct ALLOWED_HOSTS

### 3. Test Locally First
```bash
# Install Vercel CLI
npm i -g vercel

# Test locally
vercel dev
```

### 4. Check Vercel Logs
After deployment, check:
- Vercel Dashboard → Your Project → Functions
- Click on the function to see logs
- Look for initialization errors

## Common Issues

### Issue: "Django initialization failed"
**Solution**: 
- Check that all dependencies are in `requirements.txt`
- Verify `DJANGO_SETTINGS_MODULE` is correct
- Check for import errors in settings.py

### Issue: "Module not found"
**Solution**:
- Run `pip freeze > requirements.txt` locally
- Ensure all packages are listed

### Issue: Static files not loading
**Solution**:
- Static files should be in `static/` directory
- Vercel will serve them automatically
- Check `STATIC_URL` in settings.py

### Issue: Database errors
**Solution**:
- SQLite doesn't work on Vercel (read-only filesystem)
- Use a cloud database or disable database features
- For a static portfolio, you might not need a database

## Alternative: Use a Different Platform

If Vercel continues to have issues, consider:

1. **Railway** (Recommended for Django)
   - Easy Django deployment
   - Free tier available
   - Better suited for Python apps

2. **Render**
   - Simple deployment
   - Free tier
   - Good Django support

3. **PythonAnywhere**
   - Free tier
   - Designed for Python apps
   - Easy setup

4. **Static Site Export**
   - Export Django templates to static HTML
   - Deploy to Vercel as static files
   - No serverless functions needed

## Quick Test

1. Deploy to Vercel
2. Check function logs for errors
3. If you see "Django initialization failed", check the error message
4. Share the error from logs for further debugging

