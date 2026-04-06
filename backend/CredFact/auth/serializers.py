from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.mail import send_mail
from rest_framework import serializers

from .models import PasswordResetCode

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'id',
            'username',
            'email',
            'phone',
            'department',
            'access_level',
            'is_staff',
        )


class RegisterSerializer(serializers.ModelSerializer):
    confirmPassword = serializers.CharField(write_only=True)
    accessLevel = serializers.ChoiceField(
        choices=User.ACCESS_LEVEL_CHOICES,
        source='access_level',
    )

    class Meta:
        model = User
        fields = (
            'username',
            'email',
            'phone',
            'department',
            'accessLevel',
            'password',
            'confirmPassword',
        )
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def validate_username(self, value):
        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError('A user with that username already exists.')
        return value

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError('A user with that email already exists.')
        return value

    def validate(self, attrs):
        password = attrs.get('password')
        confirm_password = attrs.pop('confirmPassword')

        if password != confirm_password:
            raise serializers.ValidationError(
                {'confirmPassword': 'Passwords do not match.'}
            )

        validate_password(password)
        return attrs

    def create(self, validated_data):
        password = validated_data.pop('password')
        return User.objects.create_user(password=password, **validated_data)


class SignupIdentityValidationSerializer(serializers.Serializer):
    username = serializers.CharField()
    email = serializers.EmailField()

    def validate_username(self, value):
        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError('A user with that username already exists.')
        return value

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError('A user with that email already exists.')
        return value


class PasswordResetRequestSerializer(serializers.Serializer):
    username = serializers.CharField()
    email = serializers.EmailField()

    def validate(self, attrs):
        username = attrs.get('username', '').strip()
        email = attrs.get('email', '').strip().lower()

        try:
            user = User.objects.get(username__iexact=username, email__iexact=email)
        except User.DoesNotExist as exc:
            raise serializers.ValidationError(
                {'detail': 'No user matches that username and email.'}
            ) from exc

        attrs['user'] = user
        return attrs

    def save(self, **kwargs):
        user = self.validated_data['user']
        reset_code = PasswordResetCode.create_for_user(user)

        send_mail(
            subject='Your Credentials Factory password reset code',
            message=(
                f'Hello {user.username},\n\n'
                f'Your password reset code is {reset_code.code}.\n'
                'It will expire in 10 minutes.\n'
            ),
            from_email=None,
            recipient_list=[user.email],
            fail_silently=False,
        )

        return reset_code


class PasswordResetCodeVerificationSerializer(serializers.Serializer):
    username = serializers.CharField()
    email = serializers.EmailField()
    code = serializers.RegexField(regex=r'^\d{6}$')

    def validate(self, attrs):
        username = attrs.get('username', '').strip()
        email = attrs.get('email', '').strip().lower()
        code = attrs.get('code', '').strip()

        try:
            user = User.objects.get(username__iexact=username, email__iexact=email)
        except User.DoesNotExist as exc:
            raise serializers.ValidationError(
                {'detail': 'No user matches that username and email.'}
            ) from exc

        reset_code = (
            PasswordResetCode.objects
            .filter(user=user, code=code, is_used=False)
            .order_by('-created_at')
            .first()
        )

        if not reset_code:
            raise serializers.ValidationError({'code': 'Invalid reset code.'})

        if reset_code.is_expired():
            reset_code.is_used = True
            reset_code.save(update_fields=['is_used'])
            raise serializers.ValidationError({'code': 'This reset code has expired.'})

        attrs['user'] = user
        attrs['reset_code'] = reset_code
        return attrs


class PasswordResetConfirmSerializer(PasswordResetCodeVerificationSerializer):
    newPassword = serializers.CharField(write_only=True)
    confirmPassword = serializers.CharField(write_only=True)

    def validate(self, attrs):
        attrs = super().validate(attrs)

        new_password = attrs.get('newPassword')
        confirm_password = attrs.get('confirmPassword')

        if new_password != confirm_password:
            raise serializers.ValidationError(
                {'confirmPassword': 'Passwords do not match.'}
            )

        validate_password(new_password, user=attrs['user'])
        return attrs

    def save(self, **kwargs):
        user = self.validated_data['user']
        reset_code = self.validated_data['reset_code']
        user.set_password(self.validated_data['newPassword'])
        user.save(update_fields=['password'])
        reset_code.is_used = True
        reset_code.save(update_fields=['is_used'])
        PasswordResetCode.objects.filter(user=user, is_used=False).update(is_used=True)
        return user
