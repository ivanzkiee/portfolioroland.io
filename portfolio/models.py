from django.db import models


class ResumeDownload(models.Model):
	full_name = models.CharField(max_length=120, blank=True)
	company = models.CharField(max_length=160, blank=True)
	work_email = models.EmailField(blank=True)
	position = models.CharField(max_length=160, blank=True)
	message = models.TextField(blank=True)
	download_datetime = models.DateTimeField()
	browser = models.CharField(max_length=80, blank=True)
	device_type = models.CharField(max_length=20, blank=True)
	operating_system = models.CharField(max_length=80, blank=True)
	ip_address = models.GenericIPAddressField(null=True, blank=True)
	referrer = models.URLField(max_length=500, blank=True)
	country = models.CharField(max_length=80, blank=True)
	city = models.CharField(max_length=80, blank=True)
	is_anonymous = models.BooleanField(default=True)
	created_at = models.DateTimeField(auto_now_add=True)

	class Meta:
		ordering = ('-download_datetime',)
		verbose_name = 'Resume download'
		verbose_name_plural = 'Resume downloads'

	def __str__(self):
		return self.full_name or 'Anonymous resume download'

