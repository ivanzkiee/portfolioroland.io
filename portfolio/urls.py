from django_distill import distill_path
from . import views

def get_none():
    return None

urlpatterns = [
    distill_path('', views.home, name='home', distill_func=get_none),
    distill_path('about/', views.about, name='about', distill_func=get_none),
    distill_path('skills/', views.skills, name='skills', distill_func=get_none),
    distill_path('projects/', views.projects, name='projects', distill_func=get_none),
    distill_path('experience/', views.experience, name='experience', distill_func=get_none),
    distill_path('resume/', views.resume, name='resume', distill_func=get_none),
    distill_path('certificates/', views.certificates, name='certificates', distill_func=get_none),
    distill_path('contact/', views.contact, name='contact', distill_func=get_none),
]

