import { Box, Container, Stack, Paper } from "@mui/material";
import ControllerModule from "../components/ControllerModule";

import SPControllerModule from "../components/SPControllerModule";
import { Typography } from "antd";
const { Title, Paragraph } = Typography;
function ProcessPage() {
  return (
    <>
      <Box
        sx={{
          backgroundImage: `url(https://logincdn.msauth.net/shared/1.0/content/images/appbackgrounds/49_6ffe0a92d779c878835b40171ffc2e13.jpg)`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center center",
          height: "100vh",
          display: "flex", // Add display flex to center the content vertically
          alignItems: "center", // Center the content vertically
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
                <SPControllerModule />
              </Paper>
              <Box
                sx={{
                  position: "relative",
                  margin: "15px",
                  minWidth: "40%",
                }}>
                <img
                  src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fsafe-img.xhscdn.com%2Fbw1%2Fd2089adf-e9ad-4904-9c3e-b9901eb95845%3FimageView2%2F2%2Fw%2F1080%2Fformat%2Fjpg&refer=http%3A%2F%2Fsafe-img.xhscdn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1706457657&t=8925d88f65c87d40164a6c4024a546a9"
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
}

export default ProcessPage;
