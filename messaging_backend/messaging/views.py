from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.contrib.auth import authenticate, get_user_model
from .models import User, Message, File, FriendRequest
from .serializers import UserSerializer, MessageSerializer, FriendRequestSerializer, ProfileSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from datetime import datetime
import os
from django.conf import settings
from django.db.models import Q
from rest_framework.parsers import MultiPartParser, FormParser
from django.utils.decorators import method_decorator

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
        logged_in_user_id = int(request.GET.get('user_id', 1))
        users = User.objects.exclude(id=logged_in_user_id)
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

class FriendRequestView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        user_id = int(request.GET.get('user_id', 1))
        incoming = FriendRequest.objects.filter(receiver_id=user_id, status='pending')
        outgoing = FriendRequest.objects.filter(sender_id=user_id, status='pending')
        serializer_in = FriendRequestSerializer(incoming, many=True)
        serializer_out = FriendRequestSerializer(outgoing, many=True)
        return Response({'incoming': serializer_in.data, 'outgoing': serializer_out.data})

    def post(self, request):
        sender_id = request.data.get('sender_id')
        receiver_id = request.data.get('receiver_id')
        if sender_id == receiver_id:
            return Response({'error': 'Cannot send request to yourself'}, status=400)
        if FriendRequest.objects.filter(sender_id=sender_id, receiver_id=receiver_id).exists():
            return Response({'error': 'Request already sent'}, status=400)
        fr = FriendRequest.objects.create(sender_id=sender_id, receiver_id=receiver_id)
        serializer = FriendRequestSerializer(fr)
        return Response(serializer.data)

class FriendRequestActionView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        req_id = request.data.get('request_id')
        action = request.data.get('action')  # 'accept' or 'reject'
        try:
            fr = FriendRequest.objects.get(id=req_id)
            if action == 'accept':
                fr.status = 'accepted'
                fr.save()
            elif action == 'reject':
                fr.status = 'rejected'
                fr.save()
            else:
                return Response({'error': 'Invalid action'}, status=400)
            return Response({'success': True, 'status': fr.status})
        except FriendRequest.DoesNotExist:
            return Response({'error': 'Request not found'}, status=404)

class FriendsListView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        user_id = int(request.GET.get('user_id', 1))
        accepted = FriendRequest.objects.filter(
            (Q(sender_id=user_id) | Q(receiver_id=user_id)),
            status='accepted'
        )
        friend_ids = set()
        for fr in accepted:
            if fr.sender_id == user_id:
                friend_ids.add(fr.receiver_id)
            else:
                friend_ids.add(fr.sender_id)
        users = User.objects.filter(id__in=friend_ids)
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

class ProfileView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        user_id = request.GET.get('user_id')
        if not user_id:
            return Response({'error': 'user_id required'}, status=400)
        try:
            user = User.objects.get(id=user_id)
            serializer = ProfileSerializer(user, context={'request': request})
            return Response(serializer.data)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)

@method_decorator(csrf_exempt, name='dispatch')
class ProfileUpdateView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [AllowAny]
    def post(self, request):
        user_id = request.data.get('user_id')
        if not user_id:
            return Response({'error': 'user_id required'}, status=400)
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)
        serializer = ProfileSerializer(user, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
