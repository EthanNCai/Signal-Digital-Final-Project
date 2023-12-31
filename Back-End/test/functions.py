import cv2
import numpy as np


def contrast(factor, image):
    # TODO: Add contrast logic here using the 'factor' parameter
    img_t = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)

    h, s, v = cv2.split(img_t)
    v_median = np.median(v)
    if factor > 0:
        mask = v > v_median
        contrast = factor + 40
        v[mask] = np.clip(cv2.add(v[mask], contrast), 0, 255).reshape(-1)
    elif factor < 0:
        mask = v < v_median
        contrast = factor + 40
        v[mask] = np.clip(cv2.add(v[mask], contrast), 0, 255).reshape(-1)
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


