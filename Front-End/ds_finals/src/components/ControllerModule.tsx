import { Box, Container, Slider, Stack, Chip } from "@mui/material";
import { BezierSplineEditor } from "react-bezier-spline-editor/react";

// 或者单独安装使用

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
  const control_point_circleProps: React.SVGProps<SVGCircleElement> = {
    r: 5, // 圆的半径
    fill: "#B4D4FF", // 填充颜色
  };
  const anchor_point_circleProps: React.SVGProps<SVGCircleElement> = {
    r: 5, // 圆的半径
    fill: "#596FB7", // 填充颜色
  };
  const nothing: React.SVGProps<SVGCircleElement> = { r: 0 };

  return (
    <>
      <script src="https://cdn.tailwindcss.com?plugins=forms,typography,aspect-ratio,line-clamp"></script>
      <Stack direction={"row"}>
        <Box sx={{ margin: "15px" }}>
          <Box sx={{ paddingTop: "20px" }}>
            <Chip label="曝光度" size="small" />
            <Slider defaultValue={50} valueLabelDisplay="auto" size="small" />
            <Chip label="光感" size="small" />
            <Slider defaultValue={50} valueLabelDisplay="auto" size="small" />
            <Chip label="对比度" size="small" />
            <Slider defaultValue={50} valueLabelDisplay="auto" size="small" />
            <Chip label="锐化" size="small" />
            <Slider defaultValue={50} valueLabelDisplay="auto" size="small" />
            <Chip label="曝光度" size="small" />
            <Slider defaultValue={50} valueLabelDisplay="auto" size="small" />
            <Chip label="光感" size="small" />
            <Slider defaultValue={50} valueLabelDisplay="auto" size="small" />
            <Chip label="对比度" size="small" />
            <Slider defaultValue={50} valueLabelDisplay="auto" size="small" />
            <Chip label="锐化" size="small" />
            <Slider defaultValue={50} valueLabelDisplay="auto" size="small" />
          </Box>
        </Box>
        <Box sx={{ margin: "15px" }}>
          <Box sx={{ paddingTop: "20px" }}>
            <Chip label="曝光度" size="small" />
            <Slider defaultValue={50} valueLabelDisplay="auto" size="small" />
            <Chip label="光感" size="small" />
            <Slider defaultValue={50} valueLabelDisplay="auto" size="small" />
            <Chip label="对比度" size="small" />
            <Slider defaultValue={50} valueLabelDisplay="auto" size="small" />
            <Chip label="Chip Filled" size="small" />
            <Slider defaultValue={50} valueLabelDisplay="auto" size="small" />
            <Chip label="曝光度" size="small" />
            <Slider defaultValue={50} valueLabelDisplay="auto" size="small" />
            <Chip label="光感" size="small" />
            <Slider defaultValue={50} valueLabelDisplay="auto" size="small" />
            <Chip label="对比度" size="small" />
            <Slider defaultValue={50} valueLabelDisplay="auto" size="small" />
            <Chip label="锐化" size="small" />
            <Slider defaultValue={50} valueLabelDisplay="auto" size="small" />
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
              <Chip label="曲线调整" size="small" />
              <BezierSplineEditor
                showPoints={false}
                indicatorSpeed={100}
                width={150}
                height={150}
                points={points}
                onPointsChange={setPoints}
                controlPointProps={control_point_circleProps}
                anchorPointProps={anchor_point_circleProps}
                indicatorProps={nothing}
              />
              <Box margin={"20px"} />
              <Chip label="调色" size="small" />

              <BezierSplineEditor
                showPoints={false}
                indicatorSpeed={100}
                width={150}
                height={150}
                points={points2}
                onPointsChange={setPoints2}
                controlPointProps={control_point_circleProps}
                anchorPointProps={anchor_point_circleProps}
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
