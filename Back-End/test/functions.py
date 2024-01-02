import cv2
import numpy as np
from pathlib import Path
import torchvision.transforms as transforms
from torchvision import models
import torch.nn.functional as F
import torch

FILE = Path(__file__).resolve()
ROOT = FILE.parents[1]  # root directory
FONT = ROOT / 'font'
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

class Face:
    def __init__(self, img):
        self.img = img  # Origin Image
        self.face = None # face
        self.face_pos = None # face position
        self.real_face = None # face after seg
        self.beautied_face = None # face after beauty

    # Load DeepLabV3 ✔
    def load_deep_lab_model(self):
        model = models.segmentation.deeplabv3_resnet101(pretrained=True)
        return model.eval()

    # Detect Face ✔
    def detect_faces(self):
        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        gray = cv2.cvtColor(self.img, cv2.COLOR_BGR2GRAY)
        self.face_pos = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
        if len(self.face_pos) == 0:
            return None, ()
        else:
            (x, y, w, h) = self.face_pos[0]
            self.face = self.img[y:y + h, x:x + w]
            return self.face, self.face_pos[0]

    # Segment Face 打勾
    def segment_face(self, model):

        h, w, _ = self.face.shape

        transform = transforms.Compose([
                transforms.ToPILImage(),
                transforms.Resize((224, 224)),
                transforms.ToTensor(),
        ])
        
        face_tensor = transform(self.face).unsqueeze(0).to(device)

        with torch.no_grad():
            output = model(face_tensor)['out'][0]
            
        mask = (output.argmax(0) > 0).float().unsqueeze(0).unsqueeze(0)

        mask_resized = F.interpolate(mask, size=(int(h), int(w)), mode='nearest').squeeze().cpu().numpy()

        self.real_face = cv2.bitwise_and(self.face, self.face, mask=(mask_resized * 255).astype(np.uint8))
        
        return self.real_face
    
    # Beauty Face
    def beauty_face(self):
        return self.real_face
    
# 美颜
def apply_beauty_filter(beauty, image):
    if beauty:
        face = Face(image)

        face_det, face_pos = face.detect_faces()

        lw = max(round(sum(image.shape) / 2 * 0.003), 2)

        if face_det is None:

            return False
            
        else:

            model = face.load_deep_lab_model().to(device)

            # 分割
            face_seg = face.segment_face(model)

            # 调用美颜API
            face_beauty = face.beauty_face()

            image = cv2.rectangle(
                image,
                (face_pos[0], face_pos[1]),
                (face_pos[0] + face_pos[2], face_pos[1] + face_pos[3]),
                (75, 25, 230),
                lw,
                cv2.LINE_AA
            )

            # 替换原始图像中的人脸区域
            image[face_pos[1]:(face_pos[1] + face_pos[3]), face_pos[0]:(face_pos[0] + face_pos[2])] = face_beauty

        return image

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


def hsl(param_list, img):
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
            adjust_img = __adjust_and_replace_color(lower=lower_red, upper=upper_red, img=img, adjust_list=adjust_value)
        elif color == 'orange':
            lower_orange = np.array([11, 43, 46], dtype=np.uint8)
            upper_orange = np.array([25, 255, 255], dtype=np.uint8)
            adjust_img = __adjust_and_replace_color(lower=lower_orange, upper=upper_orange, img=img,
                                                    adjust_list=adjust_value)
        elif color == 'yellow':
            lower_yellow = np.array([26, 43, 46], dtype=np.uint8)
            upper_yellow = np.array([34, 255, 255], dtype=np.uint8)
            adjust_img = __adjust_and_replace_color(lower=lower_yellow, upper=upper_yellow, img=img,
                                                    adjust_list=adjust_value)
        elif color == 'green':
            lower_green = np.array([35, 43, 46], dtype=np.uint8)
            upper_green = np.array([99, 255, 255], dtype=np.uint8)
            adjust_img = __adjust_and_replace_color(lower=lower_green, upper=upper_green, img=img,
                                                    adjust_list=adjust_value)
        elif color == 'blue':
            lower_blue = np.array([100, 43, 46], dtype=np.uint8)
            upper_blue = np.array([124, 255, 255], dtype=np.uint8)
            adjust_img = __adjust_and_replace_color(lower=lower_blue, upper=upper_blue, img=img,
                                                    adjust_list=adjust_value)
        elif color == 'purple':
            lower_purple = np.array([125, 43, 46], dtype=np.uint8)
            upper_purple = np.array([155, 255, 255], dtype=np.uint8)
            adjust_img = __adjust_and_replace_color(lower=lower_purple, upper=upper_purple, img=img,
                                                    adjust_list=adjust_value)
        img = adjust_img

    return img


def __adjust_and_replace_color(lower, upper, img, adjust_list):
    img_hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    mask = cv2.inRange(img_hsv, lower, upper)
    img_color = cv2.bitwise_and(img, img, mask=mask)
    img_hsl = __hsl(adjust_list, img_color)
    img_color = cv2.cvtColor(img_hsl, cv2.COLOR_HLS2BGR)
    img[mask > 0] = img_color[mask > 0]

    return img


def __hsl(adjust_list, img):
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
def exposure_api(contrast, light, image):
    image_hls = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    image_hls = cv2.convertScaleAbs(image_hls, alpha=(contrast + 10) / 20 * 2, beta=light * 10)

    return np.clip(cv2.cvtColor(image_hls, cv2.COLOR_RGB2BGR), 0, 255)


def light_api(light, image):
    image_hls = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    image_hls = cv2.convertScaleAbs(image_hls, beta=light * 10)

    return np.clip(cv2.cvtColor(image_hls, cv2.COLOR_RGB2BGR), 0, 255)


def contrast_api(contrast, image):
    image_hls = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    image_hls = cv2.convertScaleAbs(image_hls, alpha=(contrast + 10) / 20 * 2)

    return np.clip(cv2.cvtColor(image_hls, cv2.COLOR_RGB2BGR), 0, 255)


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
    image_hsv[:, :, 0] = (image_hsv[:, :, 0] + hue * 10) % 180

    # Convert back to BGR
    return np.clip(cv2.cvtColor(image_hsv, cv2.COLOR_HSV2BGR), 0, 255)


def temperature(temperature, image):
    temperature = temperature * 10
    result = np.clip(image + [-temperature // 2, 0, temperature // 2], 0, 255).astype(np.uint8)

    return result


def sharp(sharp, image):
    if sharp > 0:
        kernel = np.array([[0, -sharp, 0],
                           [-sharp, 1 + 4 * sharp, -sharp],
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


class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y


def calculate_bezier_point(P0, P1, P2, P3, t):
    u = 1 - t
    tt = t * t
    uu = u * u
    uuu = uu * u
    ttt = tt * t

    x = uuu * P0.x + 3 * uu * t * P1.x + 3 * u * tt * P2.x + ttt * P3.x
    y = uuu * P0.y + 3 * uu * t * P1.y + 3 * u * tt * P2.y + ttt * P3.y

    return Point(x, y)


def curve(input_r, input_g, input_b):
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

    # 读取图像并将其转换为RGB图像
    image_path = "test.jpg"  # 替换为你的图片路径
    image = cv2.imread(image_path)

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
    adjusted_red_channel = np.interp(red_channel.flatten(), red_bins[:-1], lookup_table_r).reshape(red_channel.shape)

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
