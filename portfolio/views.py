from django.conf import settings
from django.contrib import messages
from django.core.mail import EmailMessage
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from django.core.cache import cache
from django.db import DatabaseError
from django.http import FileResponse, JsonResponse
from django.shortcuts import redirect, render
from django.utils import timezone
from django.views.decorators.http import require_POST
from pathlib import Path
import re
from .models import ResumeDownload
import logging


logger = logging.getLogger(__name__)


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


def _request_metadata(request):
    user_agent = request.META.get('HTTP_USER_AGENT', '')
    browser = 'Other'
    for pattern, name in ((r'Edg/', 'Edge'), (r'Chrome/', 'Chrome'), (r'Firefox/', 'Firefox'), (r'Safari/', 'Safari')):
        if re.search(pattern, user_agent):
            browser = name
            break
    device_type = 'Tablet' if re.search(r'iPad|Tablet', user_agent, re.I) else 'Mobile' if re.search(r'Mobile|Android|iPhone', user_agent, re.I) else 'Desktop'
    operating_system = 'Windows' if 'Windows' in user_agent else 'iOS' if 'iPhone OS' in user_agent or 'iPad' in user_agent else 'macOS' if 'Mac OS' in user_agent else 'Android' if 'Android' in user_agent else 'Linux' if 'Linux' in user_agent else 'Other'
    return browser, device_type, operating_system


def _send_resume_download_email(download):
    subject = 'Anonymous Resume Download' if download.is_anonymous else 'New Resume Download'
    logger.info('Preparing resume download email: subject=%s recipient=%s', subject, settings.CONTACT_EMAIL)
    if download.is_anonymous:
        body = (
            'Resume Download Notification\n\n'
            'Download Details\n'
            f'Download Date: {download.download_datetime:%Y-%m-%d}\n'
            f'Download Time: {download.download_datetime:%H:%M:%S}\n\n'
            'Technical Information\n'
            f'Browser: {download.browser}\n'
            f'Device Type: {download.device_type}\n'
            f'Operating System: {download.operating_system}\n'
            f'Visitor IP Address: {download.ip_address or "Unknown"}\n'
            f'Referrer: {download.referrer or "Direct"}\n'
            'Anonymous: Yes\n'
        )
    else:
        body = (
            'Resume Download Notification\n\n'
            'Recruiter Information\n'
            f'Full Name: {download.full_name}\n'
            f'Company: {download.company}\n'
            f'Position: {download.position}\n'
            f'Work Email: {download.work_email}\n'
            f'Message: {download.message or "None"}\n\n'
            'Download Details\n'
            f'Download Date: {download.download_datetime:%Y-%m-%d}\n'
            f'Download Time: {download.download_datetime:%H:%M:%S}\n\n'
            'Technical Information\n'
            f'Browser: {download.browser}\n'
            f'Device Type: {download.device_type}\n'
            f'Operating System: {download.operating_system}\n'
            f'Visitor IP Address: {download.ip_address or "Unknown"}\n'
            f'Referrer: {download.referrer or "Direct"}\n'
            'Anonymous: No\n'
        )

    email = EmailMessage(
        subject=subject,
        body=body,
        from_email=settings.EMAIL_HOST_USER or settings.DEFAULT_FROM_EMAIL,
        to=[settings.CONTACT_EMAIL],
    )
    if not download.is_anonymous and download.work_email:
        email.reply_to = [download.work_email]
    logger.info(
        'Sending resume download email: backend=%s host=%s port=%s tls=%s ssl=%s',
        settings.EMAIL_BACKEND,
        settings.EMAIL_HOST or '<not configured>',
        settings.EMAIL_PORT,
        settings.EMAIL_USE_TLS,
        settings.EMAIL_USE_SSL,
    )
    sent_count = email.send(fail_silently=False)
    logger.info('Resume download email sent successfully: count=%s', sent_count)
    return sent_count


@require_POST
def download_resume(request):
    logger.info('Resume download form submitted')
    forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR', '')
    ip_address = forwarded_for.split(',')[0].strip() or request.META.get('REMOTE_ADDR')

    fields = {name: request.POST.get(name, '').strip() for name in ('full_name', 'company', 'work_email', 'position', 'message')}
    try:
        validate_email(fields['work_email']) if fields['work_email'] else None
    except ValidationError:
        return JsonResponse({'error': 'Please enter a valid work email address.'}, status=400)

    is_anonymous = not any(fields.values())
    if not is_anonymous and request.POST.get('consent') != '1':
        return JsonResponse({'error': 'Please confirm the professional communication consent.'}, status=400)
    browser, device_type, operating_system = _request_metadata(request)
    resume_path = Path(settings.STATICFILES_DIRS[0]) / 'portfolio/images/Resume/resume.pdf'
    try:
        resume_file = resume_path.open('rb')
    except OSError:
        logger.exception('Resume file could not be opened')
        return JsonResponse({'error': 'The resume is temporarily unavailable.'}, status=503)

    rate_key = f'resume-download:{ip_address or "unknown"}'
    if not cache.add(rate_key, True, timeout=30):
        resume_file.close()
        return JsonResponse({'error': 'Please wait a moment before trying again.'}, status=429)

    try:
        download = ResumeDownload.objects.create(
            **fields,
            download_datetime=timezone.now(),
            browser=browser,
            device_type=device_type,
            operating_system=operating_system,
            ip_address=ip_address,
            referrer=request.META.get('HTTP_REFERER', '')[:500],
            is_anonymous=is_anonymous,
        )
        logger.info('Resume download database record created: id=%s anonymous=%s', download.pk, is_anonymous)
    except DatabaseError:
        logger.exception('Resume download analytics could not be recorded')
        download = None

    if download is not None:
        try:
            _send_resume_download_email(download)
        except Exception:
            logger.exception('Email sending failed: resume download notification')

    response = FileResponse(resume_file, content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="PALASIGUE, ROLAND IVAN M._RESUME.pdf"'
    return response


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
            from_email=settings.EMAIL_HOST_USER or settings.DEFAULT_FROM_EMAIL,
            to=[settings.CONTACT_EMAIL],
            reply_to=[email],
        )

        try:
            email_message.send(fail_silently=False)
        except Exception:
            logger.exception('Contact form email delivery failed')
            messages.error(request, 'Your message could not be sent right now. Please try again later.')
        else:
            messages.success(request, 'Thank you. Your message has been sent successfully.')
            return redirect('contact')

    return render(request, 'portfolio/contact.html')


def certificates(request):
    return render(request, 'portfolio/certificates.html')

