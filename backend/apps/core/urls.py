from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def index(request):
    return JsonResponse({'message': '🎉 Welcome to the OppCo API backend!'})

urlpatterns = [
    path('', index),
    path('admin/', admin.site.urls),
    path('api/auth/', include('users.urls')),
    path('api/matching-algorithm/', include('matching_algorithm.urls')),
    path('api/feedback/', include('feedback.urls')),
]
