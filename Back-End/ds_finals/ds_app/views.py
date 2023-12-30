import os
import hashlib
from django.http import JsonResponse
from django.core.files.storage import default_storage
from django.http import HttpResponseNotFound, HttpResponse


def upload_image(request):
    if request.method == 'POST' and request.FILES.get('image'):
        file = request.FILES['image']
        file_name = file.name

        # 计算图像的MD5哈希
        md5_hash = hashlib.md5()
        for chunk in file.chunks():
            md5_hash.update(chunk)
        md5_code = md5_hash.hexdigest()

        # 构造保存的文件路径
        file_extension = os.path.splitext(file_name)[1]  # 获取文件扩展名
        md5_file_name = md5_code + file_extension
        file_path = os.path.join(os.path.dirname(__file__), 'received_img', md5_file_name)

        # 保存文件
        default_storage.save(file_path, file)

        # 返回JSON响应包含MD5码
        return JsonResponse({'md5': md5_code})

    return JsonResponse({'error': 'invalid'}, status=400)


def load_image(request, token):
    file_path = os.path.join(os.path.dirname(__file__), 'received_img', token)
    if token:
        image_extensions = ['.jpg', '.png', '.jpeg', '.gif']  # 图片文件的扩展名列表
        for extension in image_extensions:
            file_path_with_extension = file_path + extension
            try:
                with open(file_path_with_extension, 'rb') as image_file:
                    image_data = image_file.read()
                content_type = 'image/' + extension[1:]  # 根据扩展名确定 content type
                return HttpResponse(image_data, content_type=content_type)  # 返回图片数据
            except FileNotFoundError:
                continue

    return HttpResponseNotFound('Image not found')  # 如果找不到图片，返回 404 响应
