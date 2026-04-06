from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import (
    PasswordResetConfirmView,
    PasswordResetRequestView,
    PasswordResetVerifyCodeView,
    ProfileView,
    RegisterView,
    SignupIdentityValidationView,
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path(
        'register/validate-identity/',
        SignupIdentityValidationView.as_view(),
        name='validate_signup_identity',
    ),
    path('me/', ProfileView.as_view(), name='profile'),
    path('password-reset/request/', PasswordResetRequestView.as_view(), name='password_reset_request'),
    path('password-reset/verify-code/', PasswordResetVerifyCodeView.as_view(), name='password_reset_verify_code'),
    path('password-reset/confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
