from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import get_user_model

User = get_user_model()

# This view just syncs a Supabase user to your Django DB (optional)
class SupabaseUserRegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        """
        This view is optional. Use it only if you want to create a Django user
        after Supabase handles the auth part on the frontend.
        """
        email = request.data.get("email")
        supabase_uid = request.data.get("supabase_uid")
        username = email.split("@")[0]

        if not email or not supabase_uid:
            return Response({"error": "Email and Supabase UID are required."}, status=status.HTTP_400_BAD_REQUEST)

        user, created = User.objects.get_or_create(
            email=email,
            defaults={"username": username, "supabase_uid": supabase_uid}
        )

        if not created:
            return Response({"message": "User already exists."}, status=status.HTTP_200_OK)

        return Response({"message": "User synced successfully!"}, status=status.HTTP_201_CREATED)


# Supabase already does login/logout — you only need protected views now
class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "username": request.user.username,
            "email": request.user.email,
        })