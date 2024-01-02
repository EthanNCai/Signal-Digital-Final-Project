import cv2
from functions import brightness, contrast, histeq, hsl
from itertools import product

image_path = 'test.jpeg'
image_0 = cv2.imread(image_path)

"""
函数设计规则：
1.传入参数由两部分构成：参数在前面，image在后面，(如是)多个参数按照这个参数在字典出现顺序排序
例如：
def brightness(factor, image):

2.返回的时候，请务必调回BGR
例如：
adjusted_img = np.clip(cv2.cvtColor(img_hls, cv2.COLOR_HLS2BGR), 0, 255)
    return adjusted_img
    
3.函数的名字必须是这个功能本身
例如：
def brightness(factor, image):
反例:
def adjust_brightness(factor, image):

综上所述, 举一个超级例子：
比如这个功能，在字典中有两个项，那么所对应的函数则需要两个参数传入，就设计成
def crop(parameter1,parameter2,image)
* parameter1    是一个boolean
* parameter2    是一个list
* image         是一个cv2的BGR图像矩阵
"""

"""
如何测试?

0. 先自己测试功能是不是正确的（此程序只能找出运行的bug，不能检验逻辑上是不是对的）
1. 把符合设计规范的函数放到functions.py中
2. 给一个parameter项写五个测试点
3. 调整一下product函数以及for循环
4. 在function test的那个地方加入你的函数（image的链式传递记得把握好）
没有报错则是成功

"""
# 5 test points per parameter
# DO NOT test the DEFAULT VALUE (for example, 0 or [0,0,0,0])
# test some riks points
contrast_values = [-10, -5, 5, 7, 10]
brightness_values = [-10, -5, 5, 7, 10]
histeq_values = [True, True, True, True, True]
param_list = [[10, 10, 10, 5, 6, 7, 2, 3, 4, 5, -2, -5, -6, -7, -2, 10, 6, 4],
              [5, 0, 1, 10, 10, -1, -2, -5, -9, 2, 2, 5, 6, 7, 2, -10, 6, -4],
              [10, 10, 10, 5, 6, 7, 2, 3, 4, 5, -2, -5, -6, -7, -2, 10, 6, 4],
              [10, 10, 10, 5, 6, 7, 2, 3, 4, 5, -2, -5, -6, -7, -2, 10, 6, 4],
              [10, 10, 10, 5, 6, 7, 2, 3, 4, 5, -2, -5, -6, -7, -2, 10, 6, 4]]

parameter_combinations = product(contrast_values, brightness_values, histeq_values)

for contrast_p, brightness_p, histeq_p, param_list_p in parameter_combinations:

    # function_test
    image_1 = brightness(brightness_p, image_0)
    image_2 = contrast(contrast_p, image_1)
    image_3 = histeq(histeq_p, image_2)
    image_4 = hsl(param_list_p, img=image_3)

    # encoding_test
    encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), 90]

    success, encoded_image = cv2.imencode('.jpeg', image_4, encode_param)

    if success:
        pass
    else:
        print('ERROR')
