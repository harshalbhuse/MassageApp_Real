from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone

class User(AbstractUser):
    pass  # You can extend this if needed

class Message(models.Model):
    message_id = models.AutoField(primary_key=True)
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_messages')
    text = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender.username} to {self.receiver.username}: {self.text[:50]}"

class File(models.Model):
    file = models.FileField(upload_to='uploads/')
    message = models.ForeignKey(Message, on_delete=models.CASCADE, related_name='files')
    uploaded_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"File for message {self.message.id}"
