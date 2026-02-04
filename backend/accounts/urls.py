from django.urls import path
from django.views.decorators.csrf import csrf_exempt

from .views import csrf_token_view, current_user_view, login_view, logout_view, signup_view

app_name = "accounts"

urlpatterns = [
    path("signup/", csrf_exempt(signup_view), name="signup"),
    path("login/", csrf_exempt(login_view), name="login"),
    path("logout/", logout_view, name="logout"),
    path("me/", current_user_view, name="current-user"),
    path("csrf/", csrf_token_view, name="csrf-token"),
]
