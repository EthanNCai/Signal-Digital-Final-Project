import os
import cv2
import numpy as np

image_extensions = ['.png', '.jpeg', '.jpg']


def _hsl(adjust_list, img):
    h_factor = adjust_list[0]
    s_factor = adjust_list[1]
    l_factor = adjust_list[2]
    img_hls = cv2.cvtColor(img, cv2.COLOR_BGR2HLS)
    h, l, s = cv2.split(img_hls)
    h_t = (h + h_factor - 2) % 180
    l_t = np.clip(cv2.add(l, l_factor), 0, 255)
    s_t = np.clip(cv2.add(s, s_factor), 0, 255)
    img_ad_t = cv2.merge((h_t.astype(np.uint8), l_t, s_t))

    return img_ad_t


def _adjust_and_replace_color(lower, upper, img, adjust_list):
    img_hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    mask = cv2.inRange(img_hsv, lower, upper)
    img_color = cv2.bitwise_and(img, img, mask=mask)
    img_hsl = _hsl(adjust_list, img_color)
    img_color = cv2.cvtColor(img_hsl, cv2.COLOR_HLS2BGR)
    img[mask > 0] = img_color[mask > 0]

    return img


class TargetImage:

    def __init__(self, md5):

        # load image into a PIL Image instance according to md5
        file_path_no_ext = os.path.join(os.path.dirname(__file__), 'received_img', str(md5))
        for extension in image_extensions:
            file_path_with_extension = file_path_no_ext + extension
            try:
                self.image = cv2.imread(file_path_with_extension)
                if self.image is None:
                    continue
                self.image_extension = extension
                print(file_path_with_extension)
                break
            except Exception:
                continue

    def get_byte_flow_image(self):
        """
        convert the cv2's Image into byte flow image
        """

        image = self.image
        image_extension = self.image_extension

        if image_extension == '.jpg' or image_extension == '.jpeg':
            encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), 90]  # JPEG编码质量为90
        elif image_extension == '.png':
            encode_param = [int(cv2.IMWRITE_PNG_COMPRESSION), 5]  # PNG压缩级别为5
        else:
            return None

        success, encoded_image = cv2.imencode(image_extension, image, encode_param)

        if success:
            byte_flow_image = encoded_image.tobytes()
            return byte_flow_image
        else:
            return None


class ImageFactory:
    def __init__(self, parameter_dict):
        self.parameter_dict = parameter_dict

    def run(self, image):
        """
            Tip:
            '0' is the default value of the exposure operation, that
             means user did not touch this operation, so we just skip it
        """
        if self.parameter_dict['histeq'] != 0:
            image = self.histeq(self.parameter_dict['histeq'], image)
        if self.parameter_dict['brightness'] != 0:
            image = self.brightness(self.parameter_dict['brightness'], image)
        if self.parameter_dict['contrast'] != 0:
            image = self.contrast(self.parameter_dict['contrast'], image)
        if self.parameter_dict['hsl'] !=0:
            image = self.hsl(self.parameter_dict['hsl'], image)
        return image

    @staticmethod
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

    @staticmethod
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

    @staticmethod
    def histeq(his_sw, image):
        img = image

        if his_sw == True:
            b, g, r = cv2.split(img)
            b_t = cv2.equalizeHist(b)
            g_t = cv2.equalizeHist(g)
            r_t = cv2.equalizeHist(r)
            adjusted_img = cv2.merge((b_t, g_t, r_t))
        elif his_sw == False:
            adjusted_img = img

        return adjusted_img
    @staticmethod
    def hsl(param_list, image):
        img = image
        img_back = img
        group_size = 3
        param_list_2d = [param_list[i:i + group_size] for i in
                         range(0, len(param_list), group_size)]
        color_list = ['red', 'orange', 'yellow', 'green', 'blue', 'purple']
        color_dict = dict(zip(color_list, param_list_2d))
        adjust_color_dicts = {key: value for key, value in color_dict.items() if value != [0, 0, 0]}
        for color, adjust_value in adjust_color_dicts.items():
            if color == 'red':
                lower_red = np.array([0, 50, 50], dtype=np.uint8)
                upper_red = np.array([10, 255, 255], dtype=np.uint8)
                adjust_img = _adjust_and_replace_color(lower=lower_red, upper=upper_red, img=img,
                                                       adjust_list=adjust_value)
            elif color == 'orange':
                lower_orange = np.array([11, 43, 46], dtype=np.uint8)
                upper_orange = np.array([25, 255, 255], dtype=np.uint8)
                adjust_img = _adjust_and_replace_color(lower=lower_orange, upper=upper_orange, img=img,
                                                       adjust_list=adjust_value)
            elif color == 'yellow':
                lower_yellow = np.array([26, 43, 46], dtype=np.uint8)
                upper_yellow = np.array([34, 255, 255], dtype=np.uint8)
                adjust_img = _adjust_and_replace_color(lower=lower_yellow, upper=upper_yellow, img=img,
                                                       adjust_list=adjust_value)
            elif color == 'green':
                lower_green = np.array([35, 43, 46], dtype=np.uint8)
                upper_green = np.array([99, 255, 255], dtype=np.uint8)
                adjust_img = _adjust_and_replace_color(lower=lower_green, upper=upper_green, img=img,
                                                       adjust_list=adjust_value)
            elif color == 'blue':
                lower_blue = np.array([100, 43, 46], dtype=np.uint8)
                upper_blue = np.array([124, 255, 255], dtype=np.uint8)
                adjust_img = _adjust_and_replace_color(lower=lower_blue, upper=upper_blue, img=img,
                                                       adjust_list=adjust_value)
            elif color == 'purple':
                lower_purple = np.array([125, 43, 46], dtype=np.uint8)
                upper_purple = np.array([155, 255, 255], dtype=np.uint8)
                adjust_img = _adjust_and_replace_color(lower=lower_purple, upper=upper_purple, img=img,
                                                       adjust_list=adjust_value)
            img = adjust_img

        adjust_img = img
        img = img_back

        return adjust_img
