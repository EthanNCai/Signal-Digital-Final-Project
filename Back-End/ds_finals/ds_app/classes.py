import os
import cv2
import numpy as np
from pathlib import Path

FILE = Path(__file__).resolve()
ROOT = FILE.parents[2]  # root directory
FONT = ROOT / 'font'

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
        # if self.parameter_dict['left_turn'] != False or self.parameter_dict['right_turn'] != False:
        #    image = self.turn(self.parameter_dict['left_turn'], self.parameter_dict['right_turn'], image)
        if self.parameter_dict['crop']:
            image = self.crop(self.parameter_dict['crop'], self.parameter_dict['crop_arg'], image)
        if self.parameter_dict['hue'] != 0:
            image = self.hue(self.parameter_dict['hue'], image)
        if self.parameter_dict['temperature'] != 0:
            image = self.temperature(self.parameter_dict['temperature'], image)
        if self.parameter_dict['saturation'] != 0:
            image = self.saturation(self.parameter_dict['saturation'], image)
        if self.parameter_dict['sharp'] != 0:
            image = self.sharp(self.parameter_dict['sharp'], image)
        if self.parameter_dict['smooth'] != 0:
            image = self.smooth(self.parameter_dict['smooth'], image)
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

    @staticmethod
    def turn(right_turn, left_turn, image):
        # TODO: Control the rotation of the image by right_turn, left_turn
        if right_turn:
            image = cv2.transpose(image)
            image = cv2.flip(image, flipCode=1)

        elif left_turn:
            image = cv2.transpose(image)
            image = cv2.flip(image, flipCode=0)

        return image

    @staticmethod
    def crop(crop, crop_arg, image):
        # TODO: Crop the image by crop and crop_arg, which is a bool and [left, bottom, right, top]
        if crop:
            height, width, _ = image.shape

            left = int(crop_arg[0] * width / 100)
            bottom = int(crop_arg[1] * height / 100)
            right = int(crop_arg[2] * width / 100)
            top = int(crop_arg[3] * height / 100)

            image = image[bottom:top, left:right]

        return image

    @staticmethod
    def saturation(saturation, image):
        # TODO: Image Saturation
        image_hls = cv2.cvtColor(image, cv2.COLOR_BGR2HLS)

        saturation = (saturation + 10) / 20 * 2

        image_hls[:, :, 2] = np.clip(image_hls[:, :, 2] * saturation, 0, 255)

        return np.clip(cv2.cvtColor(image_hls, cv2.COLOR_HLS2BGR), 0, 255)

    @staticmethod
    def hue(hue, image):

        image_hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)

        # Adjust hue
        image_hsv[:, :, 0] = (image_hsv[:, :, 0] + hue * 10) % 180

        # Convert back to BGR
        return np.clip(cv2.cvtColor(image_hsv, cv2.COLOR_HSV2BGR), 0, 255)

    @staticmethod
    def temperature(temperature, image):

        image_hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)

        temperature = (temperature + 10) / 20 * 2

        image_hsv[:, :, 1] = np.clip(image_hsv[:, :, 1] * temperature, 0, 255)
        image_hsv[:, :, 2] = np.clip(image_hsv[:, :, 2] * temperature, 0, 255)

        return np.clip(cv2.cvtColor(image_hsv, cv2.COLOR_HSV2BGR), 0, 255)

    @staticmethod
    def sharp(sharp, image):

        if sharp > 0:
            kernel = np.array([[0, -sharp, 0],
                               [-sharp, 1 + 4 * sharp, -sharp],
                               [0, -sharp, 0]])
            sharpened_image = cv2.filter2D(image, -1, kernel)
        else:
            sharpened_image = image

        return sharpened_image

    @staticmethod
    def smooth(smooth, image):

        if smooth > 0:
            blurred_image = cv2.GaussianBlur(image, (0, 0), smooth)
            smoothed_image = cv2.addWeighted(image, -0.5, blurred_image, 1.5, 0)
        else:
            smoothed_image = image

        return smoothed_image
