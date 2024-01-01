import { Box, Container, Stack, Paper } from "@mui/material";
import ControllerModule from "../components/ControllerModule";
import { useState, useEffect } from "react";
import SPControllerModule from "../components/SPControllerModule";
import { Typography } from "antd";
import { ParameterContext, Parameter_Dict } from "../types/interfaces";
const { Title, Paragraph } = Typography;

const ProcessPage: React.FC = () => {
  var parameter: Parameter_Dict = {
    crop: false,
    hue: 0,
    smooth: 0,
    temperature: 0,
    sharp: 0,
    saturation: 0,
    brightness: 0,
    contrast: 0,
    crop_arg: [0, 0, 100, 100],
  };
  const [isPreviewText, setIsPreviewText] = useState(false);
  const [isPreviewCrop, setIsPreviewCrop] = useState(false);
  const [crop, setCrop] = useState(false);
  const [dotext, setDotext] = useState(false);
  const [text, setText] = useState("");
  const [hue, setHue] = useState(0);
  const [smooth, setSmooth] = useState(0);
  const [temperature, setTemperature] = useState(0);
  const [sharp, setSharp] = useState(0);
  const [saturation, setSaturation] = useState(0);
  const [brightness, setExposure] = useState(0);
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
  }, [crop]);
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
          setExposure,
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
              maxWidth: "90%",
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
                <Box sx={{ maxWidth: "25%" }}>
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
