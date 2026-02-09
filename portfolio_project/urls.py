"""
URL configuration for portfolio_project project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve
from django.urls import re_path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('portfolio.urls')),
]

# Serve static and media files in development
if settings.DEBUG:
    # Manually serve static files with correct MIME types
    static_root = settings.STATICFILES_DIRS[0] if settings.STATICFILES_DIRS else settings.STATIC_ROOT
    urlpatterns += [
        re_path(r'^static/(?P<path>.*)$', serve, {
            'document_root': static_root,
            'show_indexes': False,
        }),
    ]
    # Serve media files
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

