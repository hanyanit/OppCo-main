import jwt
from django.conf import settings
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from users.models import User  # your custom user model

class SupabaseJWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return None  # DRF will treat it as unauthenticated

        token = auth_header.split(' ')[1]

        try:
            payload = jwt.decode(token, settings.SUPABASE_JWT_SECRET, algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Supabase token expired')
        except jwt.InvalidTokenError:
            raise AuthenticationFailed('Invalid Supabase token')

        user_id = payload.get('sub')  # Supabase UID
        email = payload.get('email')

        # You can create/link Django users here
        user, _ = User.objects.get_or_create(
            email=email,
            defaults={'username': email.split('@')[0], 'supabase_uid': user_id}
        )

        return (user, None)