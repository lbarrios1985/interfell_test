from django.contrib import admin
from .models import Wallet, Movement, ConfirmTransaction

admin.site.register(Wallet)
admin.site.register(Movement)
admin.site.register(ConfirmTransaction)
