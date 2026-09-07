#!/bin/bash
# Build script for Vercel deployment
# This collects static files for Django

echo "Building Django application for Vercel..."

# Apply database migrations when a persistent DATABASE_URL is configured.
python manage.py migrate --noinput

# Collect static files
python manage.py collectstatic --noinput

echo "Build complete!"

