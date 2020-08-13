from rest_framework import viewsets
from rest_framework import permissions

from .serializers import ClientSerializer
from .models import Client

class ClientViewSet(viewsets.ModelViewSet):
  permission_classes = [permissions.IsAuthenticated]
  serializer_class = ClientSerializer
  queryset = Client.objects.all()
