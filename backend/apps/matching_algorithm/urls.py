from django.urls import path
from .views import eligible_opportunities  # make sure this view exists

urlpatterns = [
    path('eligible-opportunities/', eligible_opportunities, name='eligible-opportunities'),
]
