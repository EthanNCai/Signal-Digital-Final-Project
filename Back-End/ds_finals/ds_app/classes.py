import os
import cv2
import numpy as np
from pathlib import Path

FILE = Path(__file__).resolve()
ROOT = FILE.parents[2]  # root directory
FONT = ROOT / 'font'

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


def calculate_bezier_point(P0, P1, P2, P3, t):
    u = 1 - t
    tt = t * t
    uu = u * u
    uuu = uu * u
    ttt = tt * t

    x = uuu * P0.x + 3 * uu * t * P1.x + 3 * u * tt * P2.x + ttt * P3.x
    y = uuu * P0.y + 3 * uu * t * P1.y + 3 * u * tt * P2.y + ttt * P3.y

    return Point(x, y)


class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y


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
        if self.parameter_dict['exposure_contrast'] != 0 or self.parameter_dict['exposure_brightness'] != 0:
            image = self.exposure(self.parameter_dict['exposure_contrast'], self.parameter_dict['exposure_brightness'],
                                  image)
        if self.parameter_dict['exposure_contrast'] != 0:
            image = self.contrast(self.parameter_dict['exposure_contrast'], image)
        if self.parameter_dict['exposure_brightness'] != 0:
            image = self.brightness(self.parameter_dict['exposure_brightness'], image)
        if self.parameter_dict['brightness'] != 0:
            image = self.brightness(self.parameter_dict['brightness'], image)
        if self.parameter_dict['contrast'] != 0:
            image = self.contrast(self.parameter_dict['contrast'], image)
        if self.parameter_dict['hsl'] != 0:
            image = self.hsl(self.parameter_dict['hsl'], image)
        # if self.parameter_dict['left_turn'] != False or self.parameter_dict['right_turn'] != False:
        #    image = self.turn(self.parameter_dict['left_turn'], self.parameter_dict['right_turn'], image)
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
        if (self.parameter_dict['r_curve'] != [0, 0, 0.25, 0.25, 0.75, 0.75, 1, 1]
                or self.parameter_dict['g_curve'] != [0, 0, 0.25, 0.25, 0.75, 0.75, 1, 1]
                or self.parameter_dict['b_curve'] != [0, 0, 0.25, 0.25, 0.75, 0.75, 1, 1]):
            image = self.curve(self.parameter_dict['r_curve'], self.parameter_dict['g_curve'],
                               self.parameter_dict['b_curve'], image)
        if self.parameter_dict['dotext']:
            image = self.text(self.parameter_dict['dotext'], self.parameter_dict['text'],
                              self.parameter_dict['position'], image)
        if self.parameter_dict['crop']:
            image = self.crop(self.parameter_dict['crop'], self.parameter_dict['crop_arg'], image)

        return image

    @staticmethod
    def exposure(contrast, brightness, image):

        img_float = image.astype(float)

        adjusted_image = np.clip((img_float - 128) * (contrast+10)/20 * 2 + 128, 0, 255).astype(np.uint8)

        adjusted_image = np.clip(img_float + brightness * 10, 0, 255).astype(np.uint8)

        return adjusted_image

    @staticmethod
    def brightness(brightness, image):

        img_float = image.astype(float)

        adjusted_image = np.clip(img_float + brightness*10, 0, 255).astype(np.uint8)

        return adjusted_image

    @staticmethod
    def contrast(contrast, image):

        image_hls = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

        
        img_float = image.astype(float)

        contrast = (contrast+10)/20 * 2


        if contrast == 0:
            contrast = 0.1
        
        adjusted_image = np.clip((img_float - 128) * contrast + 128, 0, 255).astype(np.uint8)

        return adjusted_image
    
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
            print(crop_arg)
            x1 = crop_arg[0]
            y1 = crop_arg[1]
            x2 = crop_arg[2]
            y2 = crop_arg[3]
            # x1 < x2
            # y1 < y2
            left = int(x1 * width / 100)
            right = int(x2 * width / 100)
            bottom = int((100-y1) * height / 100)
            top = int((100-y2) * height / 100)

            image = image[top:bottom, left:right]

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
        temperature = temperature * 10
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

            cv2.putText(image, text, (x, y), cv2.FONT_HERSHEY_SIMPLEX, 5, (75, 25, 230), 10)

        return image

    @staticmethod
    def curve(input_r, input_g, input_b, image):
        # 定义红色通道的控制点
        P0_r = Point(input_r[0], 1 - input_r[1])
        P1_r = Point(input_r[2], 1 - input_r[3])  # 控制点1
        P2_r = Point(input_r[4], 1 - input_r[5])  # 控制点2
        P3_r = Point(input_r[6], 1 - input_r[7])

        # 定义绿色通道的控制点
        P0_g = Point(input_g[0], 1 - input_g[1])
        P1_g = Point(input_g[2], 1 - input_g[3])  # 控制点1
        P2_g = Point(input_g[4], 1 - input_g[5])  # 控制点2
        P3_g = Point(input_g[6], 1 - input_g[7])

        # 定义蓝色通道的控制点
        P0_b = Point(input_b[0], 1 - input_b[1])
        P1_b = Point(input_b[2], 1 - input_b[3])  # 控制点1
        P2_b = Point(input_b[4], 1 - input_b[5])  # 控制点2
        P3_b = Point(input_b[6], 1 - input_b[7])

        # 计算曲线上的点
        points = []
        num_points = 256  # 用于绘制曲线的点的数量

        for i in range(num_points):
            t = i / (num_points - 1)
            point_r = calculate_bezier_point(P0_r, P1_r, P2_r, P3_r, t)
            point_g = calculate_bezier_point(P0_g, P1_g, P2_g, P3_g, t)
            point_b = calculate_bezier_point(P0_b, P1_b, P2_b, P3_b, t)
            points.append((point_r, point_g, point_b))

        # 提取 x 和 y 坐标
        x_coords = [point[0].x * 255 for point in points]
        y_coords_r = [point[0].y * 255 for point in points]
        y_coords_g = [point[1].y * 255 for point in points]
        y_coords_b = [point[2].y * 255 for point in points]

        # 分离RGB通道
        blue_channel, green_channel, red_channel = cv2.split(image)

        # 应用曲线映射变换到红色通道
        red_hist, red_bins = np.histogram(red_channel.flatten(), 256, [0, 256])  # 计算红色通道直方续：

        green_hist, green_bins = np.histogram(green_channel.flatten(), 256, [0, 256])  # 计算绿色通道直方图
        blue_hist, blue_bins = np.histogram(blue_channel.flatten(), 256, [0, 256])  # 计算蓝色通道直方图

        # 进行曲线映射变换
        red_cdf = red_hist.cumsum()  # 计算红色通道累积分布函数
        red_cdf_normalized = red_cdf / red_cdf[-1]  # 归一化
        lookup_table_r = np.interp(np.arange(256), x_coords, y_coords_r).astype(np.uint8)
        adjusted_red_channel = np.interp(red_channel.flatten(), red_bins[:-1], lookup_table_r).reshape(
            red_channel.shape)

        green_cdf = green_hist.cumsum()  # 计算绿色通道累积分布函数
        green_cdf_normalized = green_cdf / green_cdf[-1]  # 归一化
        lookup_table_g = np.interp(np.arange(256), x_coords, y_coords_g).astype(np.uint8)
        adjusted_green_channel = np.interp(green_channel.flatten(), green_bins[:-1], lookup_table_g).reshape(
            green_channel.shape)

        blue_cdf = blue_hist.cumsum()  # 计算蓝色通道累积分布函数
        blue_cdf_normalized = blue_cdf / blue_cdf[-1]  # 归一化
        lookup_table_b = np.interp(np.arange(256), x_coords, y_coords_b).astype(np.uint8)
        adjusted_blue_channel = np.interp(blue_channel.flatten(), blue_bins[:-1], lookup_table_b).reshape(
            blue_channel.shape)

        # 将调整后的通道重新合并为图像
        adjusted_image = cv2.merge((adjusted_blue_channel, adjusted_green_channel, adjusted_red_channel))
        adjusted_image = adjusted_image.astype(np.uint8)
        return adjusted_image
