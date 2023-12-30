import os
import hashlib
from django.http import JsonResponse
from django.core.files.storage import default_storage
from django.http import HttpResponseNotFound, HttpResponse, HttpResponseNotAllowed, HttpResponseBadRequest
from .classes import TargetImage, ImageFactory
import json


def upload_image(request):
    if request.method == 'POST' and request.FILES.get('image'):
        file = request.FILES['image']
        file_name = file.name

        # calculate image's hash value aka. MD5
        md5_hash = hashlib.md5()
        for chunk in file.chunks():
            md5_hash.update(chunk)
        md5_code = md5_hash.hexdigest()

        # construct the saving path and file names
        file_extension = os.path.splitext(file_name)[1]  # 获取文件扩展名
        md5_file_name = md5_code + file_extension
        file_path = os.path.join(os.path.dirname(__file__), 'received_img', md5_file_name)

        # save
        default_storage.save(file_path, file)

        # return the MD5 value to the FRONT END
        return JsonResponse({'md5': md5_code})

    return JsonResponse({'error': 'invalid'}, status=400)


def load_image(request, md5):
    """
    Input: md5 string
    Output: original image
    """

    try:
        image_obj = TargetImage(md5)
        image_bytes = image_obj.get_byte_flow_image()
        content_type = image_obj.image_extension
        return HttpResponse(image_bytes, content_type=content_type)
    except FileNotFoundError:
        return HttpResponseNotFound('Image not found')


def image_operation(request, md5):
    """
        Input: md5 string + parameter dict (json)
        Output: modified image
    """
    if request.method == 'POST':
        try:
            raw_request_data = request.body.decode('utf-8')
            parameter_dict = json.loads(raw_request_data)
            # generate instances
            image_obj = TargetImage(md5)
            image_factory = ImageFactory(parameter_dict)

            # modify image according to parameter dictionary
            image_obj.image = image_factory.run(image_obj.image)

            # gathering output materials
            image_byte = image_obj.get_byte_flow_image()
            content_type = image_obj.image_extension
            return HttpResponse(image_byte, content_type="image/" + content_type[1:])

        except json.JSONDecodeError:
            return HttpResponseBadRequest("Invalid JSON data")

    return HttpResponseNotAllowed(['POST'])

