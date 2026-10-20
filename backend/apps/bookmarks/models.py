from django.db import models
from django.conf import settings
from matching_algorithm.models import Bursary

class Bookmark(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='bookmarks')
    bursary = models.ForeignKey(Bursary, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'bursary')  # prevent duplicates