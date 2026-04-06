from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import PasswordResetCode, User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = (
        'username',
        'email',
        'phone',
        'department',
        'access_level',
        'is_staff',
    )
    search_fields = ('username', 'email', 'phone', 'department')
    fieldsets = BaseUserAdmin.fieldsets + (
        (
            'Additional Info',
            {
                'fields': ('phone', 'department', 'access_level'),
            },
        ),
    )
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        (
            'Additional Info',
            {
                'fields': ('email', 'phone', 'department', 'access_level'),
            },
        ),
    )


@admin.register(PasswordResetCode)
class PasswordResetCodeAdmin(admin.ModelAdmin):
    list_display = ('user', 'code', 'created_at', 'expires_at', 'is_used')
    search_fields = ('user__username', 'user__email', 'code')
    list_filter = ('is_used', 'created_at', 'expires_at')
