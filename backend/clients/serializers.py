from rest_framework import serializers

from django.db import transaction
from django.contrib.auth.models import User

from .models import Client
from wallet.models import Wallet

class UserSerializer(serializers.ModelSerializer):

  class Meta:
    model = User
    write_only_fields = ["password"]
    fields = ('first_name', 'last_name', 'email','password')


class ClientSerializer(serializers.ModelSerializer):

  user = UserSerializer()

  class Meta:
    model = Client
    fields = ['id', 'user', 'phone', 'document']

  def create(self, validated_data):
    user = validated_data.pop("user")
    with transaction.atomic():
      user_created = User()
      user_created.username = user['email']
      user_created.first_name = user['first_name']
      user_created.last_name = user['last_name']
      user_created.email = user['email']
      user_created.set_password(user['password'])
      user_created.save()
      Wallet.objects.create(
        user = user_created
      )
      client = Client.objects.create(**validated_data,user=user_created)
    return client