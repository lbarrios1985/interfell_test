from django.contrib import admin
from django.urls import include, path
from django.conf.urls import url
from rest_framework import routers
from rest_framework.authtoken import views as authviews
from clients.views import ClientViewSet
from wallet.views import WalletViewSet, TransactionViewSet

router = routers.DefaultRouter()
router.register(r'clients', ClientViewSet, basename="clients")
router.register(r'wallet', WalletViewSet, basename="wallet")
router.register(r'transaction', TransactionViewSet, basename="transaction")

urlpatterns = [
    path('', include(router.urls)),
    path('admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
]

urlpatterns += [
    url(r'^api-token-auth/', authviews.obtain_auth_token),
]
