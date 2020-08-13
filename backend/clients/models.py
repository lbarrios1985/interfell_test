from django.db import models
from django.contrib.auth.models import User

class Client(models.Model):

  document = models.CharField(max_length=20)

  phone = models.CharField(max_length=20)

  user = models.OneToOneField(User, on_delete=models.CASCADE)
