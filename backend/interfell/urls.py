from django.contrib import admin
from django.urls import include, path
from django.conf.urls import url
from rest_framework import routers
from rest_framework.authtoken import views as authviews

router = routers.DefaultRouter()

urlpatterns = [
    path('', include(router.urls)),
    path('admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('csrf/', views.csrf),
]

urlpatterns += [
    url(r'^api-token-auth/', authviews.obtain_auth_token),
]
