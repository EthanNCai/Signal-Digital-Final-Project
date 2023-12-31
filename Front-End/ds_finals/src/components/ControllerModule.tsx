import { Box, Slider, Stack, Chip, Typography } from "@mui/material";
import { BezierSplineEditor } from "react-bezier-spline-editor/react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";

import React, { useState, useContext } from "react";
import { ParameterContext } from "../types/interfaces";
const ControllerModule: React.FC = () => {
  type Point = {
    x: number;
    y: number;
  };
  const initial_points: Point[] = [
    { x: 0, y: 0 },
    { x: 0.25, y: 0.25 },
    { x: 0.75, y: 0.75 },
    { x: 1, y: 1 },
  ];
  const [points, setPoints] = useState<Point[]>(initial_points);
  const [points2, setPoints2] = useState<Point[]>(initial_points);
  const [points3, setPoints3] = useState<Point[]>(initial_points);
  const [hsl, setHsl] = React.useState("female");
  const { exposure, contrast, setExposure, setContrast, sendRequest } =
    useContext(ParameterContext);
  const handleExposureChange = (event: Event, newValue: number | number[]) => {
    if (typeof newValue === "number") {
      setExposure(newValue);
    }
  };
  const handleContrastChangeCommitted = () => {
    sendRequest();
  };
  const handleContrastChange = (event: Event, newValue: number | number[]) => {
    if (typeof newValue === "number") {
      setContrast(newValue);
    }
  };
  const handleExposureChangeCommitted = () => {
    sendRequest();
  };
  const handleHslChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHsl((event.target as HTMLInputElement).value);
  };
  return (
    <>
      <script src="https://cdn.tailwindcss.com?plugins=forms,typography,aspect-ratio,line-clamp"></script>
      <Stack direction={"row"} sx={{ margin: "20px" }}>
        <Box sx={{ margin: "15px" }}>
          <Chip label="亮度" />
          <Slider
            value={exposure}
            min={-10}
            max={10}
            step={1}
            defaultValue={0}
            valueLabelDisplay="auto"
            onChange={handleExposureChange}
            onChangeCommitted={handleExposureChangeCommitted}
          />
          <Chip label="对比度" />
          <Slider
            value={contrast}
            min={-10}
            max={10}
            step={1}
            defaultValue={0}
            valueLabelDisplay="auto"
            onChange={handleContrastChange}
            onChangeCommitted={handleContrastChangeCommitted}
          />
          <Chip label="亮度" />
          <Stack direction={"row"}>
            <Typography fontSize={"small"}>A</Typography>
            <Slider defaultValue={50} valueLabelDisplay="auto" />
          </Stack>
          <Stack direction={"row"}>
            <Typography fontSize={"small"}>B</Typography>
            <Slider defaultValue={50} valueLabelDisplay="auto" />
          </Stack>

          <Chip label="锐化" />
          <Stack direction={"row"}>
            <Typography fontSize={"small"}>A</Typography>
            <Slider defaultValue={50} valueLabelDisplay="auto" />
          </Stack>
          <Stack direction={"row"}>
            <Typography fontSize={"small"}>B</Typography>
            <Slider defaultValue={50} valueLabelDisplay="auto" />
          </Stack>
          <Chip label="平滑" />
          <Slider defaultValue={50} valueLabelDisplay="auto" />
          <Chip label="色温" />
          <Slider defaultValue={50} valueLabelDisplay="auto" />
          <Chip label="色调" />
          <Slider defaultValue={50} valueLabelDisplay="auto" />
          <Chip label="饱和度" />
          <Slider defaultValue={50} valueLabelDisplay="auto" />
        </Box>
        <Box sx={{ margin: "15px" }}>
          <FormControl>
            <Chip label="HSL调色" />
            <RadioGroup
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
              value={hsl}
              onChange={handleHslChange}>
              <FormControlLabel
                value="0"
                control={<Radio size="small" />}
                label="红"
              />
              <FormControlLabel
                value="1"
                control={<Radio size="small" />}
                label="橙"
              />
              <FormControlLabel
                value="2"
                control={<Radio size="small" />}
                label="黄"
              />
              <FormControlLabel
                value="3"
                control={<Radio size="small" />}
                label="绿"
              />
              <FormControlLabel
                value="4"
                control={<Radio size="small" />}
                label="蓝"
              />
              <FormControlLabel
                value="5"
                control={<Radio size="small" />}
                label="紫"
              />
            </RadioGroup>
          </FormControl>
          <Typography>色相</Typography>
          <Slider defaultValue={50} valueLabelDisplay="auto" />
          <Typography>饱和度</Typography>
          <Slider defaultValue={50} valueLabelDisplay="auto" />
          <Typography>亮度</Typography>
          <Slider defaultValue={50} valueLabelDisplay="auto" />
        </Box>
        <Box sx={{}}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: "15px",
            }}>
            <Stack>
              <Chip label="红色通道曲线" size="small" />
              <BezierSplineEditor
                showPoints={false}
                indicatorSpeed={100}
                width={100}
                height={100}
                points={points}
                onPointsChange={setPoints}
                controlPointProps={{
                  r: 5,
                  fill: "#EF4040", //red
                }}
                anchorPointProps={{
                  r: 5,
                  fill: "#EF4040", //red
                }}
                indicatorProps={{ r: 0 }}
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
                controlPointProps={{
                  r: 5,
                  fill: "#65B741", //green
                }}
                anchorPointProps={{
                  r: 5,
                  fill: "#65B741", //green
                }}
                indicatorProps={{ r: 0 }}
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
                controlPointProps={{
                  r: 5,
                  fill: "#6DB9EF", //blue
                }}
                anchorPointProps={{
                  r: 5,
                  fill: "#6DB9EF", //blue
                }}
                indicatorProps={{ r: 0 }}
              />
            </Stack>
          </Box>
        </Box>
      </Stack>
    </>
  );
};

export default ControllerModule;
