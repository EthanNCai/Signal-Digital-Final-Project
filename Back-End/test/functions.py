import cv2
import numpy as np
from pathlib import Path
FILE = Path(__file__).resolve()
ROOT = FILE.parents[1]  # root directory
FONT = ROOT / 'font'

def contrast(factor, image):
    # TODO: Add contrast logic here using the 'factor' parameter
    img_t = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)

    h, s, v = cv2.split(img_t)
    v_median = np.median(v)

    if factor > 0:
        mask = v > v_median
        contrast = factor + 40
        v[mask] = np.clip(v[mask] + contrast, 0, 255).reshape(-1)
    elif factor < 0:
        mask = v < v_median
        contrast = factor + 40
        v[mask] = np.clip(v[mask] + contrast, 0, 255).reshape(-1)
    else:
        return image
    img_hsv = cv2.merge((h, s, v))
    adjusted_img = cv2.cvtColor(img_hsv, cv2.COLOR_HSV2BGR)
    return adjusted_img


def brightness(factor, image):
    img = image
    img_t = cv2.cvtColor(img, cv2.COLOR_BGR2HLS)
    h, l, s = cv2.split(img_t)

    if factor > 0:
        factor += 40
    elif factor < 0:
        factor -= 40

    l_t = np.clip(cv2.add(l, factor), 0, 255)
    img_hls = cv2.merge((h, l_t, s))
    adjusted_img = np.clip(cv2.cvtColor(img_hls, cv2.COLOR_HLS2BGR), 0, 255)
    return adjusted_img


def exposure_api(contrast, light, image):

    image_hls = cv2.cvtColor(image, cv2.COLOR_BGR2HLS)

    image_hls = cv2.convertScaleAbs(image_hls, alpha=(contrast+10)/20 * 2, beta= light * 10)

    return np.clip(cv2.cvtColor(image_hls, cv2.COLOR_HLS2BGR), 0, 255)


def light_api(light, image):
    image_hls = cv2.cvtColor(image, cv2.COLOR_BGR2HLS)

    image_hls = cv2.convertScaleAbs(image_hls, beta= light * 10)

    return np.clip(cv2.cvtColor(image_hls, cv2.COLOR_HLS2BGR), 0, 255)


def contrast_api(contrast, image):
    
    image_hls = cv2.cvtColor(image, cv2.COLOR_BGR2HLS)
    
    image_hls = cv2.convertScaleAbs(image_hls, alpha=(contrast + 10 ) / 20 * 2)

    return np.clip(cv2.cvtColor(image_hls, cv2.COLOR_HLS2BGR), 0, 255)


def turn(right_turn, left_turn, image):
    if right_turn:
        image = cv2.transpose(image)
        image = cv2.flip(image, flipCode=1)

    elif left_turn:
        image = cv2.transpose(image)
        image = cv2.flip(image, flipCode=0)

    return image


def crop(crop, crop_arg, image):

    if crop:
        height, width, _ = image.shape

        left = int(crop_arg[0] * width / 100)
        bottom = int(crop_arg[1] * height / 100)
        right = int(crop_arg[2] * width / 100)
        top = int(crop_arg[3] * height / 100)

        image = image[bottom:top, left:right]

    return image


def saturation(saturation, image):
    
    image_hls = cv2.cvtColor(image, cv2.COLOR_BGR2HLS)
    
    saturation = (saturation + 10) / 20 * 2

    image_hls[:, :, 2] = np.clip(image_hls[:, :, 2] * saturation, 0, 255)
    
    return np.clip(cv2.cvtColor(image_hls, cv2.COLOR_HLS2BGR), 0, 255)


def hue(hue, image):

    image_hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)

    # Adjust hue
    image_hsv[:, :, 0] = (image_hsv[:, :, 0] + hue*10) % 180

    # Convert back to BGR
    return np.clip(cv2.cvtColor(image_hsv, cv2.COLOR_HSV2BGR), 0, 255)


def temperature(temperature, image):

    image_hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)

    temperature = (temperature + 10) / 20 * 2

    image_hsv[:, :, 1] = np.clip(image_hsv[:, :, 1] * temperature, 0, 255)
    image_hsv[:, :, 2] = np.clip(image_hsv[:, :, 2] * temperature, 0, 255)

    return np.clip(cv2.cvtColor(image_hsv, cv2.COLOR_HSV2BGR), 0, 255)


def sharp(sharp, image):

    if sharp > 0:
        kernel = np.array([[0, -sharp, 0],
                           [-sharp, 1 + 4*sharp, -sharp],
                           [0, -sharp, 0]])
        sharpened_image = cv2.filter2D(image, -1, kernel)
    else:
        sharpened_image = image  # 不变

    return sharpened_image


def smooth(smooth, image):

    if smooth > 0:
        blurred_image = cv2.GaussianBlur(image, (0, 0), smooth)
        smoothed_image = cv2.addWeighted(image, -0.5, blurred_image, 1.5, 0)
    else:
        smoothed_image = image  

    return smoothed_image


# 添加文字
def add_text(freetype, text, position, font, font_scale, color, thickness, image):
    """
    在图像上添加文字

    参数：
    - text: 要添加的文字
    - position: 文字的起始位置 (x, y)
    - font: 字体类型 Default = 0
    - font_path: 字体类型 Default = 0
    - font_scale: 字体缩放因子 Default = 1
    - color: 文字颜色 (B, G, R) Default = (75, 25, 230)
    - thickness: 文字的粗细 Default = 2
    """

    # 在图像上添加文字
    cv2.putText(image, text, position, cv2.FONT_HERSHEY_SIMPLEX, font_scale, color, thickness)

    # 保存输出图像
    return image
