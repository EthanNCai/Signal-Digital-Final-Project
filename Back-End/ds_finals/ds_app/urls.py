from django.urls import path
from . import views

urlpatterns = [
    path('upload', views.upload_image, name='upload'),
    path('load_image/<str:token>', views.load_image, name='load_image'),
]
