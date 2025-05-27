from django.urls import path
from .views import LoginView, UserListView, MessageListView, root_view, message_view, signup_view, FriendRequestView, FriendRequestActionView, FriendsListView, ProfileView, ProfileUpdateView

urlpatterns = [
    path('', root_view),
    path('login', LoginView.as_view()),
    path('users', UserListView.as_view()),
    path('user/<int:user_id>/message', MessageListView.as_view()),
    path('message', message_view),
    path('signup', signup_view),
    path('friend-request', FriendRequestView.as_view()),
    path('friend-request/action', FriendRequestActionView.as_view()),
    path('friends', FriendsListView.as_view()),
    path('profile', ProfileView.as_view()),
    path('profile/update', ProfileUpdateView.as_view()),
] 

