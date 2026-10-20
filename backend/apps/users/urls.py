from django.urls import path
from .views import SupabaseUserRegisterView, ProfileView

urlpatterns = [
    path('sync/', SupabaseUserRegisterView.as_view(), name='sync-user'),
    path('dashboard/', ProfileView.as_view(), name='user-dashboard'),
]