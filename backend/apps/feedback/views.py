from django.core.mail import send_mail
from django.http import JsonResponse
from rest_framework.decorators import api_view
import os

@api_view(['POST'])
def send_feedback(request):
    subject = request.data.get('subject')
    message = request.data.get('message')

    if not subject or not message:
        return JsonResponse({'error': 'Subject and message are required.'}, status=400)

    try:
        send_mail(
            subject=subject,
            message=message,
            from_email='feedback@oppco.co.za',
            recipient_list=['feedback@oppco.co.za'],
            fail_silently=False
        )
        return JsonResponse({'message': 'Feedback sent successfully.'})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
