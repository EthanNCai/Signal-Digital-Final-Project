import { Box, Button, Slider, Stack, Chip, IconButton } from "@mui/material";
import { BezierSplineEditor } from "react-bezier-spline-editor/react";

// 或者单独安装使用
import { ChartContainer, BarPlot } from "@mui/x-charts";
import { useState } from "react";
import { Delete, Download, ForkLeft, Home } from "@mui/icons-material";

function ControllerModule() {
  type Point = {
    x: number;
    y: number;
  };
  const [points, setPoints] = useState<Point[]>([
    { x: 0, y: 0 },
    { x: 0.25, y: 0.25 },
    { x: 0.75, y: 0.75 },
    { x: 1, y: 1 },
  ]);
  const [points2, setPoints2] = useState<Point[]>([
    { x: 0, y: 0 },
    { x: 0.25, y: 0.25 },
    { x: 0.75, y: 0.75 },
    { x: 1, y: 1 },
  ]);
  const [points3, setPoints3] = useState<Point[]>([
    { x: 0, y: 0 },
    { x: 0.25, y: 0.25 },
    { x: 0.75, y: 0.75 },
    { x: 1, y: 1 },
  ]);
  const blue_circle: React.SVGProps<SVGCircleElement> = {
    r: 5, // 圆的半径
    fill: "#6DB9EF", // 填充颜色
  };
  const red_circle: React.SVGProps<SVGCircleElement> = {
    r: 5, // 圆的半径
    fill: "#EF4040", // 填充颜色
  };
  const green_circle: React.SVGProps<SVGCircleElement> = {
    r: 5, // 圆的半径
    fill: "#65B741", // 填充颜色
  };
  const nothing: React.SVGProps<SVGCircleElement> = { r: 0 };

  return (
    <>
      <script src="https://cdn.tailwindcss.com?plugins=forms,typography,aspect-ratio,line-clamp"></script>
      <Stack direction={"row"}>
        <Box sx={{ margin: "30px" }}>
          <Box sx={{ paddingTop: "20px" }}>
            <Chip label="曝光度" size="small" />

            <Slider defaultValue={50} valueLabelDisplay="auto" size="small" />

            <Chip label="光感" size="small" />
            <Slider defaultValue={50} valueLabelDisplay="auto" size="small" />
            <Chip label="对比度" size="small" />
            <Slider defaultValue={50} valueLabelDisplay="auto" size="small" />
            <Chip label="锐化" size="small" />
            <Slider defaultValue={50} valueLabelDisplay="auto" size="small" />
            <Chip label="平滑" size="small" />
            <Slider defaultValue={50} valueLabelDisplay="auto" size="small" />
            <Chip label="色温" size="small" />
            <Slider defaultValue={50} valueLabelDisplay="auto" size="small" />
            <Chip label="色调" size="small" />
            <Slider defaultValue={50} valueLabelDisplay="auto" size="small" />
            <Chip label="饱和度" size="small" />
            <Slider defaultValue={50} valueLabelDisplay="auto" size="small" />
          </Box>
          <Box>
            <Button sx={{ margin: "5px" }} variant="contained">
              直方图均衡化
            </Button>
            <Button sx={{ margin: "5px" }} variant="contained">
              平滑图像
            </Button>
            <Button sx={{ margin: "5px" }} variant="outlined">
              左转
            </Button>
            <Button sx={{ margin: "5px" }} variant="outlined">
              右转
            </Button>
          </Box>
          <Box>
            <IconButton>
              <Home />
            </IconButton>
            <IconButton>
              <Download />
            </IconButton>
          </Box>
        </Box>
        <Box sx={{ margin: "15px" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              //backdropFilter: "blur(10px)", // 添加毛玻璃效果
              backgroundColor: "rgba(255, 255, 255, 0)", // 背景颜色和透明度
              borderRadius: "10px", // 添加圆角
              marginRight: "50px",
            }}>
            <Box padding={"10px"}>
              <Chip label="红色通道曲线" size="small" />
              <BezierSplineEditor
                showPoints={false}
                indicatorSpeed={100}
                width={150}
                height={150}
                points={points}
                onPointsChange={setPoints}
                controlPointProps={red_circle}
                anchorPointProps={red_circle}
                indicatorProps={nothing}
              />

              <Box margin={"20px"} />
              <Chip label="绿色通道曲线" size="small" />

              <BezierSplineEditor
                showPoints={false}
                indicatorSpeed={100}
                width={150}
                height={150}
                points={points2}
                onPointsChange={setPoints2}
                controlPointProps={green_circle}
                anchorPointProps={green_circle}
                indicatorProps={nothing}
              />

              <Box margin={"20px"} />
              <Chip label="蓝色通道曲线" size="small" />

              <BezierSplineEditor
                showPoints={false}
                indicatorSpeed={100}
                width={150}
                height={150}
                points={points3}
                onPointsChange={setPoints3}
                controlPointProps={blue_circle}
                anchorPointProps={blue_circle}
                indicatorProps={nothing}
              />
            </Box>
          </Box>
        </Box>
      </Stack>
    </>
  );
}

export default ControllerModule;
