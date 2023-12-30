import {
  Box,
  Button,
  Slider,
  Stack,
  Chip,
  IconButton,
  ButtonGroup,
  TextField,
} from "@mui/material";

import * as React from "react";
// 或者单独安装使用

import { Download, GitHub, Home } from "@mui/icons-material";
function valuetext(value: number) {
  return `${value}°C`;
}
function SPControllerModule() {
  const [value, setValue] = React.useState<number[]>([20, 37]);

  const handleChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue as number[]);
  };
  const [value2, setValue2] = React.useState<number[]>([20, 37]);

  const handleChange2 = (event: Event, newValue: number | number[]) => {
    setValue2(newValue as number[]);
  };

  return (
    <>
      <Box sx={{ margin: "30px" }}>
        <Box marginX={"10px"}>
          <Chip label="裁切" />

          <Stack direction={"row"}>
            <Box sx={{ minWidth: "80%" }}>
              <Slider
                getAriaLabel={() => "Temperature range"}
                value={value}
                onChange={handleChange}
                valueLabelDisplay="auto"
                getAriaValueText={valuetext}
              />
              <Slider
                getAriaLabel={() => "Temperature range"}
                value={value2}
                onChange={handleChange2}
                valueLabelDisplay="auto"
                getAriaValueText={valuetext}
              />
            </Box>
            <Box sx={{ marginX: "10px" }}>
              <Button variant="contained">应用</Button>
              <Button>预览裁切</Button>
            </Box>
          </Stack>

          <TextField
            sx={{ marginY: "10px" }}
            label="添加文字"
            variant="outlined"
            size="small"
          />
          <Stack direction={"row"}>
            <Box sx={{ minWidth: "80%" }}>
              <Slider
                defaultValue={50}
                valueLabelDisplay="auto"
                color="warning"
              />
              <Slider
                defaultValue={50}
                valueLabelDisplay="auto"
                color="warning"
              />
            </Box>
            <Box sx={{ marginX: "10px" }}>
              <Button variant="contained">应用</Button>
              <Button>预览位置</Button>
            </Box>
          </Stack>
        </Box>
        <Box>
          <Button sx={{ margin: "5px" }} variant="contained">
            直方图均衡化
          </Button>
          <ButtonGroup>
            <Button variant="outlined">左转</Button>
            <Button variant="outlined">右转</Button>
          </ButtonGroup>
        </Box>
        <Box sx={{ margin: "10px" }}>
          <IconButton>
            <Home />
          </IconButton>
          <IconButton>
            <Download />
          </IconButton>
          <IconButton>
            <GitHub />
          </IconButton>
        </Box>
      </Box>
    </>
  );
}

export default SPControllerModule;
