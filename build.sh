#!/bin/bash
# Build script for Vercel deployment
# This collects static files for Django

echo "Building Django application for Vercel..."

# Collect static files
python manage.py collectstatic --noinput

echo "Build complete!"

