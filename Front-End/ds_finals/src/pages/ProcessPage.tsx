import { Box, Container, Stack, Paper } from "@mui/material";
import ControllerModule from "../components/ControllerModule";
import { useState } from "react";
import SPControllerModule from "../components/SPControllerModule";
import { Typography } from "antd";
import { Md5 } from "../types/interfaces";
const { Title, Paragraph } = Typography;

const ProcessPage: React.FC = () => {
  const [md5, setMd5] = useState<string>("");
  const [imageurl, setImageurl] = useState<string>(
    "https://s1.hdslb.com/bfs/static/laputa-search/client/assets/nodata.67f7a1c9.png"
  );
  const ReceivingMd5 = (md5: string) => {
    setMd5(md5);
    setImageurl(`http://127.0.0.1:8000/api/load_image/${md5}`);
  };
  return (
    <>
      <Box
        sx={{
          backgroundImage: `url(https://logincdn.msauth.net/shared/1.0/content/images/appbackgrounds/49_6ffe0a92d779c878835b40171ffc2e13.jpg)`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center center",
          height: "100vh",
          display: "flex",
          alignItems: "center",
        }}>
        <Container
          style={{
            maxWidth: "70%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
          <Stack>
            <Box marginX={"20px"}>
              <Typography>
                <Title>图像编辑工具 - 2024.1</Title>
                <Paragraph>
                  <blockquote>作者：蔡俊志、涂江得、李伟佳</blockquote>
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
                }}>
                <SPControllerModule md5={md5} onMd5Change={ReceivingMd5} />
              </Paper>
              <Box
                sx={{
                  position: "relative",
                  margin: "15px",
                  minWidth: "40%",
                }}>
                <img
                  src={imageurl}
                  alt="图片"
                  style={{
                    maxWidth: "100%",
                    borderRadius: "10px",
                    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.5)",
                  }}
                />
              </Box>

              <Paper
                elevation={10}
                sx={{
                  width: "100%",
                  height: "100%",
                  margin: "15px",
                  backdropFilter: "blur(10px)",
                  backgroundColor: "rgba(255, 255, 255, 0.5)",
                  borderRadius: "10px",
                }}>
                <ControllerModule />
              </Paper>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default ProcessPage;
