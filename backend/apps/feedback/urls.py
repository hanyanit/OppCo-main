from django.urls import path
from .views import send_feedback

urlpatterns = [
    path('', send_feedback),  # /api/feedback/
]
