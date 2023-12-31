import { Box, Container } from "@mui/material";

function UploadPage() {
  return (
    <Box
      sx={{
        backgroundImage: `url(https://logincdn.msauth.net/shared/1.0/content/images/appbackgrounds/49_6ffe0a92d779c878835b40171ffc2e13.jpg)`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        height: "101%",
        width: "101%",
      }}>
      <Container
        maxWidth="md"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}>
        <Box
          sx={{
            width: "50%",
            backdropFilter: "blur(4px)",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            borderRadius: "10px",
          }}></Box>
      </Container>
    </Box>
  );
}

export default UploadPage;
