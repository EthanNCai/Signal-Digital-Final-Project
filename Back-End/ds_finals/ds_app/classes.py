import os
import cv2
import numpy as np

image_extensions = ['.png', '.jpeg', '.jpg']


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

        if self.parameter_dict['brightness'] != 0:
            image = self.brightness(self.parameter_dict['brightness'], image)
        if self.parameter_dict['contrast'] != 0:
            image = self.contrast(self.parameter_dict['contrast'], image)
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

