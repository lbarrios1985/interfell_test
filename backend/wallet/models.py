from django.db import models
from django.contrib.auth.models import User

MOVEMENT_CHOICES = (
  ('DEBIT','debit'),
  ('CREDIT','credit'),
)

class Wallet(models.Model):

  amount = models.DecimalField(default=0.0, max_digits=20, decimal_places=2, blank=False)

  user = models.OneToOneField(User, on_delete=models.SET_NULL, null = True)

  updated_at = models.DateTimeField(auto_now=True)

class Movement(models.Model):

  wallet = models.ForeignKey(Wallet, on_delete=models.SET_NULL, null = True)

  amount = models.DecimalField(max_digits=20, decimal_places=2, blank=False)

  movement_type = models.CharField(max_length=6, choices=MOVEMENT_CHOICES)

  created_at = models.DateTimeField(auto_now_add=True)

class ConfirmTransaction(models.Model):

  user = models.OneToOneField(User, on_delete=models.SET_NULL, null = True)

  amount = models.DecimalField(max_digits=20, decimal_places=2, blank=False)

  token = models.CharField(max_length=6)

  created_at = models.DateTimeField(auto_now_add=True)
