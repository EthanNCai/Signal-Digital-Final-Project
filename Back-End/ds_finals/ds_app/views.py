from django.shortcuts import render
from django.http import JsonResponse
import os
from django.conf import settings
from django.core.files.storage import default_storage

def upload(request):
    if request.method == 'POST' and request.FILES.get('image'):
        file = request.FILES['image']
        file_name = file.name
        save_uploaded_image(file, file_name)
        return JsonResponse({'message': 'File uploaded successfully.'})
    return JsonResponse({'error': 'Invalid request.'}, status=400)

def save_uploaded_image(file, file_name):
    file_path = os.path.join(os.path.dirname(__file__), 'received_img', file_name)
    default_storage.save(file_path, file)

