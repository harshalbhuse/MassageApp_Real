from django.urls import path
from .views import LoginView, UserListView, MessageListView, root_view, message_view, signup_view

urlpatterns = [
    path('', root_view),
    path('login', LoginView.as_view()),
    path('users', UserListView.as_view()),
    path('user/<int:user_id>/message', MessageListView.as_view()),
    path('message', message_view),
    path('signup', signup_view),
] 