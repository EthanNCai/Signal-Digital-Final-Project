from django.urls import path
from . import views

urlpatterns = [
    path('upload', views.upload_image, name='upload'),
    path('load_image/<str:md5>', views.load_image, name='load_image'),
    path('image_operation/<str:md5>', views.image_operation, name='image_operation'),
    path('download_image/<str:md5>', views.download_image, name ='download_image'),
]
