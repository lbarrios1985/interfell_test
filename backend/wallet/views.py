from rest_framework import viewsets
from rest_framework import permissions
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Wallet
from .serializers import (
  WalletSerializer, FormPaymentSerializer,
  SendPaymentSerializer, BalanceSerializer
)

class WalletViewSet(viewsets.ViewSet):
  permission_classes = [permissions.IsAuthenticated]

  def list(self, request):
    queryset = Wallet.objects.filter(user=request.user)
    serializer = WalletSerializer(queryset, many=True)
    return Response(serializer.data)

  @action(detail=False, methods=['post'])
  def charge_wallet(self, request):
    serializer = FormPaymentSerializer(data=request.data,context={'user': request.user})
    if serializer.is_valid():
      serializer.save()
      return Response({"message":"The funds was added successfully"})
    return Response(serializer.errors, status=400)

  @action(detail=False, methods=['post'])
  def get_balance(self, request):
    serializer = BalanceSerializer(data=request.data,context={'user': request.user})
    if serializer.is_valid():
      wallet = Wallet.objects.filter(user=request.user).get()
      return Response({"data":wallet.amount})
    return Response(serializer.errors, status=400)


class TransactionViewSet(viewsets.ViewSet):
  permission_classes = [permissions.IsAuthenticated]

  def create(self, request):
    serializer = SendPaymentSerializer(data=request.data,context={'user': request.user})
    if serializer.is_valid():
      serializer.save()
      return Response({"message":"A confirmation mail was sended"})
    return Response(serializer.errors, status=400)

  @action(detail=True, methods=['post'])
  def confirm(self, request, pk=None):
    serializer = SendPaymentSerializer()
    serializer.confirm_transaction(pk, request.user)
    return Response({"message":"Transaction confirmed"})

