from django.conf import settings
from django.contrib import messages
from django.core.mail import EmailMessage
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from django.shortcuts import redirect, render


def home(request):
    return render(request, 'portfolio/home.html')


def about(request):
    return render(request, 'portfolio/about.html')


def skills(request):
    return render(request, 'portfolio/skills.html')


def projects(request):
    return render(request, 'portfolio/projects.html')


def experience(request):
    return render(request, 'portfolio/experience.html')


def resume(request):
    return render(request, 'portfolio/resume.html')


def contact(request):
    if request.method == 'POST':
        name = request.POST.get('name', '').strip()
        email = request.POST.get('email', '').strip()
        subject = request.POST.get('subject', '').strip()
        message = request.POST.get('message', '').strip()

        if not all((name, email, subject, message)):
            messages.error(request, 'Please complete all fields before sending your message.')
            return render(request, 'portfolio/contact.html', status=400)

        try:
            validate_email(email)
        except ValidationError:
            messages.error(request, 'Please enter a valid email address.')
            return render(request, 'portfolio/contact.html', status=400)

        email_message = EmailMessage(
            subject=f'Portfolio contact: {subject}',
            body=(
                f'Name: {name}\n'
                f'Email: {email}\n\n'
                f'Message:\n{message}'
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[settings.CONTACT_EMAIL],
            reply_to=[email],
        )

        try:
            email_message.send(fail_silently=False)
        except Exception:
            messages.error(request, 'Your message could not be sent right now. Please try again later.')
        else:
            messages.success(request, 'Thank you. Your message has been sent successfully.')
            return redirect('contact')

    return render(request, 'portfolio/contact.html')


def certificates(request):
    return render(request, 'portfolio/certificates.html')

