import os
from django.http import JsonResponse
from django.core.files.storage import default_storage

"""
[ READ ME ]
Write Functions in funcs.py
Write Classes in class.py
"""


def upload(request):
    if request.method == 'POST' and request.FILES.get('image'):
        file = request.FILES['image']
        file_name = file.name
        file_path = os.path.join(os.path.dirname(__file__), 'received_img', file_name)
        default_storage.save(file_path, file)
        return JsonResponse({'message': 'File uploaded successfully.'})
    return JsonResponse({'error': 'Invalid request.'}, status=400)
