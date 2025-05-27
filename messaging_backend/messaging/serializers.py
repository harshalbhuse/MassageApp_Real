from rest_framework import serializers
from .models import User, Message, File

class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = ['id', 'file_type', 'file']

class MessageSerializer(serializers.ModelSerializer):
    files = FileSerializer(many=True, read_only=True)
    class Meta:
        model = Message
        fields = ['message_id', 'sender', 'receiver', 'text', 'timestamp', 'files']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name'] 