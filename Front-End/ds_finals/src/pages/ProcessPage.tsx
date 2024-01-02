import { Box, Container, Stack, Paper } from "@mui/material";
import ControllerModule from "../components/ControllerModule";
import { useState, useEffect } from "react";
import SPControllerModule from "../components/SPControllerModule";
import { Typography } from "antd";
import { ParameterContext, Parameter_Dict } from "../types/interfaces";
const { Title, Paragraph } = Typography;
type Point = {
  x: number;
  y: number;
};
const ProcessPage: React.FC = () => {
  var parameter: Parameter_Dict = {
    dotext: false,
    exposure_contrast: 0,
    exposure_brightness: 0,
    beauty: false,
    histeq: false,
    left_turn: false,
    right_turn: false,
    text: "",
    position: [],
    hsl: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    crop: false,
    hue: 0,
    smooth: 0,
    temperature: 0,
    sharp: 0,
    saturation: 0,
    brightness: 0,
    contrast: 0,
    crop_arg: [0, 0, 100, 100],
    r_curve: [0, 0, 0.25, 0.25, 0.75, 0.75, 1, 1],
    g_curve: [0, 0, 0.25, 0.25, 0.75, 0.75, 1, 1],
    b_curve: [0, 0, 0.25, 0.25, 0.75, 0.75, 1, 1],
  };
  const [r_curve, setR_curve] = useState<Point[]>([
    { x: 0, y: 0 },
    { x: 0.25, y: 0.25 },
    { x: 0.75, y: 0.75 },
    { x: 1, y: 1 },
  ]);
  const [g_curve, setG_curve] = useState<Point[]>([
    { x: 0, y: 0 },
    { x: 0.25, y: 0.25 },
    { x: 0.75, y: 0.75 },
    { x: 1, y: 1 },
  ]);
  const [b_curve, setB_curve] = useState<Point[]>([
    { x: 0, y: 0 },
    { x: 0.25, y: 0.25 },
    { x: 0.75, y: 0.75 },
    { x: 1, y: 1 },
  ]);
  const [beauty, setBeauty] = useState(false);
  const [histeq, setHisteq] = useState(false);
  const [left_turn, setLeft_turn] = useState(false);
  const [right_turn, setRight_turn] = useState(false);
  const [position, setPosition] = useState([0, 0]);
  const [hsl, setHsl] = useState([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]);
  const [exposure_contrast, setExposure_contrast] = useState(0);
  const [exposure_brightness, setExposure_brightness] = useState(0);
  const [isPreviewCrop, setIsPreviewCrop] = useState(false);
  const [isPreviewText, setIsPreviewText] = useState(false);
  const [crop, setCrop] = useState(false);
  const [dotext, setDotext] = useState(false);
  const [text, setText] = useState("");
  const [hue, setHue] = useState(0);
  const [smooth, setSmooth] = useState(0);
  const [temperature, setTemperature] = useState(0);
  const [sharp, setSharp] = useState(0);
  const [saturation, setSaturation] = useState(0);
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);
  const [crop_arg, serCrop_arg] = useState([0, 0, 100, 100]);
  const [md5, setMd5] = useState<string>("");
  const [initialRender, setInitialRender] = useState(true);
  const [imageurl, setImageurl] = useState<string>(
    "https://s1.hdslb.com/bfs/static/laputa-search/client/assets/nodata.67f7a1c9.png"
  );
  const ReceivingMd5 = (md5: string) => {
    setMd5(md5);
    setImageurl(`http://127.0.0.1:8000/api/load_image/${md5}`);
  };
  useEffect(() => {
    if (initialRender) {
      setInitialRender(false);
    } else {
      sendRequest();
    }
  }, [crop, r_curve, g_curve, b_curve, dotext]);
  const sendRequest = () => {
    parameter.brightness = brightness;
    parameter.contrast = contrast;
    parameter.hue = hue;
    parameter.saturation = saturation;
    parameter.sharp = sharp;
    parameter.smooth = smooth;
    parameter.temperature = temperature;
    parameter.crop_arg = crop_arg;
    parameter.crop = crop;
    parameter.exposure_brightness = exposure_brightness;
    parameter.exposure_contrast = exposure_contrast;
    parameter.hsl = hsl;
    parameter.position = position;
    parameter.dotext = dotext;
    parameter.text = text;
    for (let i = 0; i < 4; i++) {
      parameter.r_curve[2 * i] = r_curve[i].x;
      parameter.r_curve[2 * i + 1] = 1 - r_curve[i].y;
      parameter.g_curve[2 * i] = g_curve[i].x;
      parameter.g_curve[2 * i + 1] = 1 - g_curve[i].y;
      parameter.b_curve[2 * i] = b_curve[i].x;
      parameter.b_curve[2 * i + 1] = 1 - b_curve[i].y;
    }
    console.log(crop);
    fetch(`http://127.0.0.1:8000/api/image_operation/${md5}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parameter),
    })
      .then((response) => response.blob())
      .then((blob) => {
        const imageUrl = URL.createObjectURL(blob);
        setTimeout(() => {
          setImageurl(imageUrl);
        }, 50);
      });
  };
  return (
    <>
      {" "}
      <ParameterContext.Provider
        value={{
          beauty,
          hsl,
          text,
          exposure_brightness,
          exposure_contrast,
          histeq,
          left_turn,
          right_turn,
          r_curve,
          g_curve,
          b_curve,
          position,
          crop,
          dotext,
          isPreviewText,
          isPreviewCrop,
          hue,
          smooth,
          temperature,
          sharp,
          saturation,
          brightness,
          contrast,
          crop_arg,
          setBrightness,
          setContrast,
          sendRequest,
          serCrop_arg,
          setHue,
          setSmooth,
          setTemperature,
          setSharp,
          setSaturation,
          setIsPreviewText,
          setIsPreviewCrop,
          setCrop,
          setDotext,
          setR_curve,
          setG_curve,
          setB_curve,
          setExposure_contrast,
          setExposure_brightness,
          setBeauty,
          setHisteq,
          setLeft_turn,
          setRight_turn,
          setText,
          setPosition,
          setHsl,
        }}>
        <Box
          sx={{
            backgroundImage: `url(https://logincdn.msauth.net/shared/1.0/content/images/appbackgrounds/49_6ffe0a92d779c878835b40171ffc2e13.jpg)`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center center",
            height: "150vh",
          }}>
          <Container
            style={{
              maxWidth: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
            <Stack>
              <Box marginX={"20px"}>
                <Typography>
                  <Title>图像编辑工具 - 2024.1</Title>
                  <Paragraph>
                    <blockquote>
                      作者：蔡俊志、涂江得、李伟佳
                      <br />
                      Tools: React + Django
                    </blockquote>
                  </Paragraph>
                </Typography>
              </Box>
              <Stack
                direction={"row"}
                sx={{ width: "100%", justifyContent: "center" }}>
                <Paper
                  elevation={10}
                  sx={{
                    margin: "15px",
                    width: "100%",
                    height: "100%",
                    backdropFilter: "blur(10px)",
                    backgroundColor: "rgba(255, 255, 255, 0.5)",
                    borderRadius: "10px",
                    maxWidth: "25%",
                  }}>
                  <SPControllerModule md5={md5} onMd5Change={ReceivingMd5} />
                </Paper>
                <Box sx={{ maxWidth: "35%" }}>
                  <Box
                    sx={{
                      position: "relative",
                      margin: "15px",
                      width: "auto",
                      height: "auto",
                      maxWidth: "100%",
                      borderRadius: "10px",
                      boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.5)",
                    }}>
                    <img
                      src={imageurl}
                      alt="图片"
                      style={{
                        display: "block",
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "10px",
                      }}
                    />
                    {isPreviewCrop && (
                      <div
                        style={{
                          content: '""',
                          position: "absolute",
                          top: `${100 - crop_arg[3]}%`,
                          left: `${crop_arg[0]}%`,
                          right: `${100 - crop_arg[2]}%`,
                          bottom: `${crop_arg[1]}%`,
                          backgroundColor: "rgba(188, 255, 255, 0.5)",
                          borderRadius: "10px",
                        }}></div>
                    )}
                    {isPreviewText && (
                      <div
                        style={{
                          content: '""',
                          position: "absolute",
                          top: `${position[1]}%`,
                          left: `${position[0]}%`,
                          right: `${100 - (position[0] + 2)}%`,
                          bottom: `${100 - (position[1] + 2)}%`,
                          backgroundColor: "rgba(255, 255, 0, 1)",
                          borderRadius: "50px",
                          boxShadow: "1 2 20px rgba(0, 0, 0, 9)",
                        }}></div>
                    )}
                  </Box>
                </Box>
                <Paper
                  elevation={10}
                  sx={{
                    width: "100%",
                    height: "100%",
                    margin: "15px",
                    maxWidth: "30%",
                    minWidth: "30%",
                    backdropFilter: "blur(10px)",
                    backgroundColor: "rgba(255, 255, 255, 0.5)",
                    borderRadius: "10px",
                  }}>
                  <ControllerModule />
                </Paper>
              </Stack>
            </Stack>
          </Container>
        </Box>{" "}
      </ParameterContext.Provider>
    </>
  );
};

export default ProcessPage;
