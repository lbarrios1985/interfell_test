from rest_framework import serializers

from django.db import transaction
from django.conf import settings
from django.core.mail import send_mail
from django.utils.crypto import get_random_string

from .models import Wallet, Movement, ConfirmTransaction

class WalletSerializer(serializers.ModelSerializer):
  class Meta:
    model = Wallet
    fields = ['id', 'user', 'amount', 'updated_at']

class FormPaymentSerializer(serializers.Serializer):

  document = serializers.CharField(max_length=20)

  phone = serializers.CharField(max_length=20)

  amount = serializers.DecimalField(max_digits=20, decimal_places=2)

  def create(self, validated_data):
    user = self.context['user']
    wallet = Wallet.objects.filter(user=user).first()
    Movement.objects.create(
      wallet = wallet,
      amount = validated_data["amount"],
      movement_type = "credit"
    )
    wallet.amount += validated_data["amount"]
    wallet.save()
    return validated_data
    #raise serializers.ValidationError("")

class BalanceSerializer(serializers.Serializer):

  document = serializers.CharField(max_length=20)

  phone = serializers.CharField(max_length=20)

class SendPaymentSerializer(serializers.Serializer):

  amount = serializers.DecimalField(max_digits=20, decimal_places=2)

  def validate(self, data):
    user = self.context['user']
    wallet = Wallet.objects.filter(user=user).first()
    if data['amount'] > wallet.amount:
      raise serializers.ValidationError("Insufficient funds")
    return data

  def create(self, validated_data):
    with transaction.atomic():
      user = self.context['user']
      token = get_random_string(length=6)
      ConfirmTransaction.objects.update_or_create(
        user = user, 
        defaults = {
          "token": token,
          "amount": validated_data['amount']
        }
      )
      URL = settings.FRONTEND_URL + "admin/confirmation/"+token
      A_TAG = "<a href='"+URL+"' target='_blank'>Confirmation</>"
      HTML_MESSAGE = """
        We send a <b>confirmation</b> url with transaction token:
        <br/><br/>
      """ + A_TAG + """
        <br/><br/>
        For the amount: 
      """ + str(validated_data['amount'])
      MESSAGE = "We send a confirmation url with transaction token: "+URL + " For the amount " + str(validated_data['amount'])
      send_mail(
        subject = "Transaction Validation", 
        message = MESSAGE, 
        from_email = "mywallet@mail.com", 
        recipient_list = [user.email], 
        fail_silently=False, 
        html_message=HTML_MESSAGE)
      return validated_data

  def confirm_transaction(self, token, user):
    confirm = ConfirmTransaction.objects.filter(token=token,user=user).first()
    if(confirm):
      wallet = Wallet.objects.filter(user=user).first()
      Movement.objects.create(
        wallet = wallet,
        amount = confirm.amount,
        movement_type = "debit"
      )
      wallet.amount -= confirm.amount
      wallet.save()
      confirm.token = ""
      confirm.amount = 0
      confirm.save()
      return True
    else:
      raise serializers.ValidationError({"non_field_errors":["Incorrect token"]})