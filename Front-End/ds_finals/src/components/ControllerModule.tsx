import { Box, Slider, Stack, Chip } from "@mui/material";
import { BezierSplineEditor } from "react-bezier-spline-editor/react";

import { useState } from "react";

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
            <Chip label="曝光度" />
            <Slider defaultValue={50} valueLabelDisplay="auto" />
            <Chip label="光感" />
            <Slider defaultValue={50} valueLabelDisplay="auto" />
            <Chip label="对比度" />
            <Slider defaultValue={50} valueLabelDisplay="auto" />
            <Chip label="锐化" />
            <Slider defaultValue={50} valueLabelDisplay="auto" />
            <Chip label="平滑" />
            <Slider defaultValue={50} valueLabelDisplay="auto" />
            <Chip label="色温" />
            <Slider defaultValue={50} valueLabelDisplay="auto" />
            <Chip label="色调" />
            <Slider defaultValue={50} valueLabelDisplay="auto" />
            <Chip label="饱和度" />
            <Slider defaultValue={50} valueLabelDisplay="auto" />
          </Box>
        </Box>
        <Box sx={{ marginTop: "85px" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}>
            <Box marginRight={"20px"}>
              <Chip label="红色通道曲线" size="small" />
              <BezierSplineEditor
                showPoints={false}
                indicatorSpeed={100}
                width={100}
                height={100}
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
                width={100}
                height={100}
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
                width={100}
                height={100}
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
