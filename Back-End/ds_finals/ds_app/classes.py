import os
import cv2
from PIL import Image, ImageEnhance
from io import BytesIO

image_extensions = ['.jpeg','.jpg', '.png', '.gif']


class TargetImage:

    def __init__(self, md5):

        # load image into a PIL Image instance according to md5
        file_path_no_ext = os.path.join(os.path.dirname(__file__), 'received_img', str(md5))
        for extension in image_extensions:
            file_path_with_extension = file_path_no_ext + extension
            try:
                print(file_path_with_extension)
                self.image = cv2.imread(file_path_with_extension)
                self.image_extension = extension
                print(file_path_with_extension)
                break
            except FileNotFoundError:
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

        if self.parameter_dict['exposure'] != 0:
            image = self.exposure(self.parameter_dict['exposure'], image)
        if self.parameter_dict['contrast'] != 0:
            image = self.contrast(self.parameter_dict['contrast'], image)
        return image

    @staticmethod
    def exposure(factor, image):
        # TODO: Add exposure logic here using the 'value' parameter
        adjusted_img = cv2.convertScaleAbs(image, alpha=(factor + 10) / 20 * 2)
        return adjusted_img

    @staticmethod
    def contrast(factor, image):
        # TODO: Add contrast logic here using the 'value' parameter
        adjusted_img = cv2.convertScaleAbs(image, alpha=(factor + 10) / 20 * 2)
        return adjusted_img
