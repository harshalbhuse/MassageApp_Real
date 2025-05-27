from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.contrib.auth import authenticate, get_user_model
from .models import User, Message, File
from .serializers import UserSerializer, MessageSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from datetime import datetime
import os
from django.conf import settings
from django.db.models import Q

# Create your views here.

class LoginView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        try:
            username = request.data.get('username')
            password = request.data.get('password')
            print('DEBUG LOGIN:', username, password)  # Debug print
            
            if not username or not password:
                return Response({
                    'success': False, 
                    'error': 'Username and password are required'
                }, status=400)
            
            User = get_user_model()
            user_qs = User.objects.filter(username=username)
            print('DEBUG USER EXISTS:', user_qs.exists())
            
            user = authenticate(username=username, password=password)
            if user:
                return Response({
                    'success': True, 
                    'user_id': user.id,
                    'username': user.username
                })
            return Response({
                'success': False, 
                'error': 'Invalid username or password'
            }, status=400)
        except Exception as e:
            return Response({
                'success': False,
                'error': str(e)
            }, status=500)

class UserListView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        # For demo, assume user_id=1 is logged in
        logged_in_user_id = int(request.GET.get('user_id', 1))
        messages = Message.objects.filter(receiver_id=logged_in_user_id)
        senders = set(messages.values_list('sender_id', flat=True))
        users = User.objects.filter(id__in=senders)
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

class MessageListView(APIView):
    permission_classes = [AllowAny]
    def get(self, request, user_id):
        # For demo, assume user_id=1 is logged in
        logged_in_user_id = int(request.GET.get('logged_in', 1))
        messages = Message.objects.filter(
            Q(sender_id=user_id, receiver_id=logged_in_user_id) |
            Q(sender_id=logged_in_user_id, receiver_id=user_id)
        ).order_by('timestamp')
        
        # Get sender names for each message
        message_data = []
        for msg in messages:
            sender = User.objects.get(id=msg.sender_id)
            message_data.append({
                'id': msg.message_id,
                'text': msg.text,
                'timestamp': msg.timestamp.isoformat(),
                'senderId': msg.sender_id,
                'receiverId': msg.receiver_id,
                'senderName': sender.username,
                'imageUrl': msg.file.file.url if hasattr(msg, 'file') else None
            })
        
        return Response(message_data)

@csrf_exempt
def root_view(request):
    return JsonResponse({"message": "Messaging Backend API is running."})

@csrf_exempt
def login_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')
            
            if not username or not password:
                return JsonResponse({'error': 'Username and password are required'}, status=400)
            
            user = authenticate(username=username, password=password)
            if user is not None:
                return JsonResponse({
                    'id': user.id,
                    'username': user.username
                })
            else:
                return JsonResponse({'error': 'Invalid credentials'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
def users_view(request):
    if request.method == 'GET':
        users = User.objects.all()
        return JsonResponse([{
            'id': user.id,
            'username': user.username
        } for user in users], safe=False)
    return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
def user_messages_view(request, user_id):
    if request.method == 'GET':
        messages = Message.objects.filter(receiver_id=user_id).order_by('timestamp')
        return JsonResponse([{
            'id': msg.id,
            'text': msg.text,
            'timestamp': msg.timestamp.isoformat(),
            'senderId': msg.sender_id,
            'receiverId': msg.receiver_id,
            'imageUrl': msg.file.file.url if msg.file else None
        } for msg in messages], safe=False)
    return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
def message_view(request):
    if request.method == 'POST':
        try:
            print('DEBUG POST DATA:', request.POST)
            print('DEBUG FILES:', request.FILES)
            sender_id = request.POST.get('sender')
            receiver_id = request.POST.get('receiver')
            text = request.POST.get('text', '')
            file = request.FILES.get('file')

            if not sender_id or not receiver_id:
                return JsonResponse({'error': 'Sender and receiver are required'}, status=400)

            # Create message
            message = Message.objects.create(
                text=text,
                sender_id=sender_id,
                receiver_id=receiver_id,
                timestamp=datetime.now()
            )

            # Handle file upload if present
            if file:
                # Create uploads directory if it doesn't exist
                upload_dir = os.path.join(settings.MEDIA_ROOT, 'uploads')
                os.makedirs(upload_dir, exist_ok=True)

                # Save file
                file_obj = File.objects.create(
                    file=file,
                    message=message
                )

            return JsonResponse({
                'id': message.message_id,
                'text': message.text,
                'timestamp': message.timestamp.isoformat(),
                'senderId': message.sender_id,
                'receiverId': message.receiver_id,
                'imageUrl': message.file.file.url if hasattr(message, 'file') else None
            })
        except Exception as e:
            print('DEBUG ERROR:', str(e))
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
def signup_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            first_name = data.get('first_name')
            last_name = data.get('last_name')
            username = data.get('username')
            password = data.get('password')
            email = data.get('email')
            if not all([first_name, last_name, username, password, email]):
                return JsonResponse({'error': 'All fields are required'}, status=400)
            User = get_user_model()
            if User.objects.filter(username=username).exists():
                return JsonResponse({'error': 'Username already exists'}, status=400)
            if User.objects.filter(email=email).exists():
                return JsonResponse({'error': 'Email already exists'}, status=400)
            user = User.objects.create_user(
                username=username,
                password=password,
                email=email,
                first_name=first_name,
                last_name=last_name
            )
            return JsonResponse({'success': True, 'user_id': user.id, 'username': user.username})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Method not allowed'}, status=405)
