# Vercel Deployment Troubleshooting

## Common Issues and Solutions

### 500 Internal Server Error / Function Crashed

**Possible Causes:**

1. **Django Not Initialized Properly**
   - Check Vercel build logs for Django initialization errors
   - Ensure `DJANGO_SETTINGS_MODULE` is set correctly
   - Verify all dependencies are in `requirements.txt`

2. **Import Errors**
   - Make sure all Python packages are listed in `requirements.txt`
   - Check that file paths are correct (case-sensitive on Linux)

3. **Static Files Not Found**
   - Run `python manage.py collectstatic` locally
   - Ensure static files are in `static/` directory
   - Check `STATIC_URL` and `STATIC_ROOT` in settings.py

4. **Database Issues**
   - SQLite doesn't work on Vercel (read-only filesystem)
   - Use a cloud database or disable database features if not needed

### Debugging Steps

1. **Check Vercel Logs**
   - Go to Vercel Dashboard → Your Project → Functions
   - Click on the function to see logs
   - Look for Python errors or tracebacks

2. **Test Locally with Vercel CLI**
   ```bash
   vercel dev
   ```
   This runs your function locally and shows errors

3. **Check Environment Variables**
   - Ensure `DEBUG=False` in production
   - Set a proper `SECRET_KEY`
   - Add your domain to `ALLOWED_HOSTS`

4. **Verify File Structure**
   ```
   your-project/
   ├── api/
   │   ├── __init__.py
   │   └── index.py
   ├── portfolio/
   ├── portfolio_project/
   ├── static/
   ├── vercel.json
   └── requirements.txt
   ```

### Alternative Solutions

If Django continues to have issues on Vercel:

1. **Use a Different Platform**
   - **Railway**: Great for Django apps
   - **Render**: Easy Django deployment
   - **PythonAnywhere**: Free tier available
   - **Heroku**: Traditional option

2. **Static Site Generation**
   - Export Django templates to static HTML
   - Deploy static files to Vercel
   - Use a headless CMS for content

3. **Hybrid Approach**
   - Deploy Django API separately (Railway/Render)
   - Deploy frontend to Vercel
   - Connect via API calls

### Quick Fixes

**If you see "Module not found":**
```bash
# Add missing package to requirements.txt
pip freeze > requirements.txt
```

**If static files don't load:**
```python
# In settings.py, ensure:
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
```

**If you see database errors:**
```python
# In settings.py, you can disable database if not needed:
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': ':memory:',  # In-memory database
    }
}
```

### Getting Help

1. Check Vercel build logs
2. Review Django error logs
3. Test locally with `vercel dev`
4. Check Vercel community forums
5. Consider using a Django-friendly platform

