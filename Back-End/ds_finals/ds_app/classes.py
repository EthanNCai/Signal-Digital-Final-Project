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

        #if self.parameter_dict['exposure_contrast'] != 0 and self.parameter_dict['exposure_brightness'] != 0:
        #    image = self.exposure(self.parameter_dict['exposure_contrast'], self.parameter_dict['brightness'], image)
        if self.parameter_dict['brightness'] != 0:
            image = self.brightness(self.parameter_dict['brightness'], image)
        if self.parameter_dict['contrast'] != 0:
            image = self.contrast(self.parameter_dict['contrast'], image)
        #if self.parameter_dict['left_turn'] != False or self.parameter_dict['right_turn'] != False:
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
        if self.parameter_dict['dotext'] != False:
            image = self.text(self.parameter_dict['dotext'] ,self.parameter_dict['text'], self.parameter_dict['position'], image)
        return image
        
    @staticmethod
    def exposure(contrast, light, image):

        image_hls = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

        image_hls = cv2.convertScaleAbs(image_hls, alpha=(contrast+10)/20 * 2, beta= light * 10)

        return np.clip(cv2.cvtColor(image_hls, cv2.COLOR_RGB2BGR), 0, 255)

    @staticmethod
    def brightness(brightness, image):
        image_hls = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

        image_hls = cv2.convertScaleAbs(image_hls, beta= brightness * 10)

        return np.clip(cv2.cvtColor(image_hls, cv2.COLOR_RGB2BGR), 0, 255)

    @staticmethod
    def contrast(contrast, image):
        
        image_hls = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        
        image_hls = cv2.convertScaleAbs(image_hls, alpha=(contrast + 10 ) / 20 * 2)

        return np.clip(cv2.cvtColor(image_hls, cv2.COLOR_RGB2BGR), 0, 255)
    
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

        temperature = temperature*10
        result = np.clip(image + [-temperature // 2, 0, temperature // 2], 0, 255).astype(np.uint8)
    
        return result
    
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

    @staticmethod
    def text(dotext, text, position, image):
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
        if dotext:
            height, width, _ = image.shape

            x, y = int(position[0] * width / 100), int(position[1] * height / 100)

            (text_width, text_height), baseline = cv2.getTextSize(text, cv2.FONT_HERSHEY_SIMPLEX, 1, 2)

            x -= text_width // 2
            y -= text_height // 2

            cv2.putText(image, text, (x, y), cv2.FONT_HERSHEY_SIMPLEX, 1, (75, 25, 230), 2)

        return image