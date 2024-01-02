import { Box, Slider, Stack, Chip, Typography } from "@mui/material";
import { BezierSplineEditor } from "react-bezier-spline-editor/react";

import React, { useState, useContext } from "react";
import { ParameterContext } from "../types/interfaces";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";

type Point = {
  x: number;
  y: number;
};
const ControllerModule: React.FC = () => {
  const initial_points: Point[] = [
    { x: 0, y: 0 },
    { x: 0.25, y: 0.25 },
    { x: 0.75, y: 0.75 },
    { x: 1, y: 1 },
  ];

  const {
    r_curve,
    g_curve,
    b_curve,
    setR_curve,
    setG_curve,
    setB_curve,
    setBrightness,
    setContrast,
    sendRequest,
    setExposure_contrast,
    setExposure_brightness,
    setHue,
    setSmooth,
    setTemperature,
    setSharp,
    setSaturation,
    hsl,
    setHsl,
  } = useContext(ParameterContext);

  return (
    <>
      <script src="https://cdn.tailwindcss.com?plugins=forms,typography,aspect-ratio,line-clamp"></script>
      <Stack direction={"row"} sx={{ margin: "20px" }}>
        <Box sx={{ margin: "15px" }}>
          <Chip label="亮度" />
          <Slider
            min={-10}
            max={10}
            step={1}
            defaultValue={0}
            valueLabelDisplay="auto"
            onChange={(event: Event, newValue: number | number[]) => {
              if (typeof newValue === "number") {
                setBrightness(newValue);
              }
            }}
            onChangeCommitted={() => {
              sendRequest();
            }}
          />
          <Chip label="对比度" />
          <Slider
            min={-10}
            max={10}
            step={1}
            defaultValue={0}
            valueLabelDisplay="auto"
            onChange={(event: Event, newValue: number | number[]) => {
              if (typeof newValue === "number") {
                setContrast(newValue);
              }
            }}
            onChangeCommitted={() => {
              sendRequest();
            }}
          />
          <Chip label="曝光" />
          <Stack direction={"row"}>
            <Typography
              sx={{
                display: "inline-block",
                marginRight: "10px",
                marginTop: "5px",
                whiteSpace: "nowrap",
              }}
              variant="caption">
              对比
            </Typography>
            <Slider
              min={-10}
              max={10}
              step={1}
              defaultValue={0}
              valueLabelDisplay="auto"
              onChange={(event: Event, newValue: number | number[]) => {
                if (typeof newValue === "number") {
                  setExposure_contrast(newValue);
                }
              }}
              onChangeCommitted={() => {
                sendRequest();
              }}
            />
          </Stack>
          <Stack direction={"row"}>
            <Typography
              sx={{
                display: "inline-block",
                marginRight: "10px",
                marginTop: "5px",
                whiteSpace: "nowrap",
              }}
              variant="caption">
              亮度
            </Typography>
            <Slider
              min={-10}
              max={10}
              step={1}
              defaultValue={0}
              valueLabelDisplay="auto"
              onChange={(event: Event, newValue: number | number[]) => {
                if (typeof newValue === "number") {
                  setExposure_brightness(newValue);
                }
              }}
              onChangeCommitted={() => {
                sendRequest();
              }}
            />
          </Stack>

          <Chip label="锐化" />
          <Slider
            min={0}
            max={10}
            step={1}
            defaultValue={0}
            valueLabelDisplay="auto"
            onChange={(event: Event, newValue: number | number[]) => {
              if (typeof newValue === "number") {
                setSharp(newValue);
              }
            }}
            onChangeCommitted={() => {
              sendRequest();
            }}
          />
          <Chip label="平滑" />
          <Slider
            min={0}
            max={10}
            step={1}
            defaultValue={0}
            valueLabelDisplay="auto"
            onChange={(event: Event, newValue: number | number[]) => {
              if (typeof newValue === "number") {
                setSmooth(newValue);
              }
            }}
            onChangeCommitted={() => {
              sendRequest();
            }}
          />
          <Chip label="色温" />
          <Slider
            min={-10}
            max={10}
            step={1}
            defaultValue={0}
            valueLabelDisplay="auto"
            onChange={(event: Event, newValue: number | number[]) => {
              if (typeof newValue === "number") {
                setTemperature(newValue);
              }
            }}
            onChangeCommitted={() => {
              sendRequest();
            }}
          />
          <Chip label="色调" />
          <Slider
            min={-10}
            max={10}
            step={1}
            defaultValue={0}
            valueLabelDisplay="auto"
            onChange={(event: Event, newValue: number | number[]) => {
              if (typeof newValue === "number") {
                setHue(newValue);
              }
            }}
            onChangeCommitted={() => {
              sendRequest();
            }}
          />
          <Chip label="饱和度" />
          <Slider
            min={-10}
            max={10}
            step={1}
            defaultValue={0}
            valueLabelDisplay="auto"
            onChange={(event: Event, newValue: number | number[]) => {
              if (typeof newValue === "number") {
                setSaturation(newValue);
              }
            }}
            onChangeCommitted={() => {
              sendRequest();
            }}
          />
        </Box>
        <Box sx={{ margin: "15px", maxWidth: "24%", minWidth: "24%" }}>
          <Chip label="HSL" sx={{ margin: "10px" }} />
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header">
              <Typography>红</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="caption">色相</Typography>
              <Slider
                min={-10}
                max={10}
                step={1}
                defaultValue={0}
                valueLabelDisplay="auto"
                onChange={(event: Event, newValue: number | number[]) => {
                  if (typeof newValue === "number") {
                    const newhsl = hsl;
                    newhsl[0] = newValue;
                    setHsl(newhsl);
                  }
                }}
                onChangeCommitted={() => {
                  sendRequest();
                }}
              />
              <Typography variant="caption">饱和度</Typography>
              <Slider
                min={-10}
                max={10}
                step={1}
                defaultValue={0}
                valueLabelDisplay="auto"
                onChange={(event: Event, newValue: number | number[]) => {
                  if (typeof newValue === "number") {
                    const newhsl = hsl;
                    newhsl[1] = newValue;
                    setHsl(newhsl);
                  }
                }}
                onChangeCommitted={() => {
                  sendRequest();
                }}
              />
              <Typography variant="caption">亮度</Typography>
              <Slider
                min={-10}
                max={10}
                step={1}
                defaultValue={0}
                valueLabelDisplay="auto"
                onChange={(event: Event, newValue: number | number[]) => {
                  if (typeof newValue === "number") {
                    const newhsl = hsl;
                    newhsl[2] = newValue;
                    setHsl(newhsl);
                  }
                }}
                onChangeCommitted={() => {
                  sendRequest();
                }}
              />
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2a-content"
              id="panel2a-header">
              <Typography>橙</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="caption">色相</Typography>
              <Slider
                min={-10}
                max={10}
                step={1}
                defaultValue={0}
                valueLabelDisplay="auto"
                onChange={(event: Event, newValue: number | number[]) => {
                  if (typeof newValue === "number") {
                    const newhsl = hsl;
                    newhsl[3] = newValue;
                    setHsl(newhsl);
                  }
                }}
                onChangeCommitted={() => {
                  sendRequest();
                }}
              />
              <Typography variant="caption">饱和度</Typography>
              <Slider
                min={-10}
                max={10}
                step={1}
                defaultValue={0}
                valueLabelDisplay="auto"
                onChange={(event: Event, newValue: number | number[]) => {
                  if (typeof newValue === "number") {
                    const newhsl = hsl;
                    newhsl[4] = newValue;
                    setHsl(newhsl);
                  }
                }}
                onChangeCommitted={() => {
                  sendRequest();
                }}
              />
              <Typography variant="caption">亮度</Typography>
              <Slider
                min={-10}
                max={10}
                step={1}
                defaultValue={0}
                valueLabelDisplay="auto"
                onChange={(event: Event, newValue: number | number[]) => {
                  if (typeof newValue === "number") {
                    const newhsl = hsl;
                    newhsl[5] = newValue;
                    setHsl(newhsl);
                  }
                }}
                onChangeCommitted={() => {
                  sendRequest();
                }}
              />
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2a-content"
              id="panel3a-header">
              <Typography>黄</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="caption">色相</Typography>
              <Slider
                min={-10}
                max={10}
                step={1}
                defaultValue={0}
                valueLabelDisplay="auto"
                onChange={(event: Event, newValue: number | number[]) => {
                  if (typeof newValue === "number") {
                    const newhsl = hsl;
                    newhsl[6] = newValue;
                    setHsl(newhsl);
                  }
                }}
                onChangeCommitted={() => {
                  sendRequest();
                }}
              />
              <Typography variant="caption">饱和度</Typography>
              <Slider
                min={-10}
                max={10}
                step={1}
                defaultValue={0}
                valueLabelDisplay="auto"
                onChange={(event: Event, newValue: number | number[]) => {
                  if (typeof newValue === "number") {
                    const newhsl = hsl;
                    newhsl[1] = newValue;
                    setHsl(newhsl);
                  }
                }}
                onChangeCommitted={() => {
                  sendRequest();
                }}
              />
              <Typography variant="caption">亮度</Typography>
              <Slider
                min={-10}
                max={10}
                step={1}
                defaultValue={0}
                valueLabelDisplay="auto"
                onChange={(event: Event, newValue: number | number[]) => {
                  if (typeof newValue === "number") {
                    const newhsl = hsl;
                    newhsl[2] = newValue;
                    setHsl(newhsl);
                  }
                }}
                onChangeCommitted={() => {
                  sendRequest();
                }}
              />
            </AccordionDetails>
          </Accordion>{" "}
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2a-content"
              id="panel4a-header">
              <Typography>绿</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="caption">色相</Typography>
              <Slider
                min={-10}
                max={10}
                step={1}
                defaultValue={0}
                valueLabelDisplay="auto"
                onChange={(event: Event, newValue: number | number[]) => {
                  if (typeof newValue === "number") {
                    const newhsl = hsl;
                    newhsl[9] = newValue;
                    setHsl(newhsl);
                  }
                }}
                onChangeCommitted={() => {
                  sendRequest();
                }}
              />
              <Typography variant="caption">饱和度</Typography>
              <Slider
                min={-10}
                max={10}
                step={1}
                defaultValue={0}
                valueLabelDisplay="auto"
                onChange={(event: Event, newValue: number | number[]) => {
                  if (typeof newValue === "number") {
                    const newhsl = hsl;
                    newhsl[10] = newValue;
                    setHsl(newhsl);
                  }
                }}
                onChangeCommitted={() => {
                  sendRequest();
                }}
              />
              <Typography variant="caption">亮度</Typography>
              <Slider
                min={-10}
                max={10}
                step={1}
                defaultValue={0}
                valueLabelDisplay="auto"
                onChange={(event: Event, newValue: number | number[]) => {
                  if (typeof newValue === "number") {
                    const newhsl = hsl;
                    newhsl[11] = newValue;
                    setHsl(newhsl);
                  }
                }}
                onChangeCommitted={() => {
                  sendRequest();
                }}
              />
            </AccordionDetails>
          </Accordion>{" "}
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2a-content"
              id="panel5a-header">
              <Typography>蓝</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="caption">色相</Typography>
              <Slider
                min={-10}
                max={10}
                step={1}
                defaultValue={0}
                valueLabelDisplay="auto"
                onChange={(event: Event, newValue: number | number[]) => {
                  if (typeof newValue === "number") {
                    const newhsl = hsl;
                    newhsl[12] = newValue;
                    setHsl(newhsl);
                  }
                }}
                onChangeCommitted={() => {
                  sendRequest();
                }}
              />
              <Typography variant="caption">饱和度</Typography>
              <Slider
                min={-10}
                max={10}
                step={1}
                defaultValue={0}
                valueLabelDisplay="auto"
                onChange={(event: Event, newValue: number | number[]) => {
                  if (typeof newValue === "number") {
                    const newhsl = hsl;
                    newhsl[13] = newValue;
                    setHsl(newhsl);
                  }
                }}
                onChangeCommitted={() => {
                  sendRequest();
                }}
              />
              <Typography variant="caption">亮度</Typography>
              <Slider
                min={-10}
                max={10}
                step={1}
                defaultValue={0}
                valueLabelDisplay="auto"
                onChange={(event: Event, newValue: number | number[]) => {
                  if (typeof newValue === "number") {
                    const newhsl = hsl;
                    newhsl[14] = newValue;
                    setHsl(newhsl);
                  }
                }}
                onChangeCommitted={() => {
                  sendRequest();
                }}
              />
            </AccordionDetails>
          </Accordion>{" "}
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2a-content"
              id="panel6a-header">
              <Typography>紫</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="caption">色相</Typography>
              <Slider
                min={-10}
                max={10}
                step={1}
                defaultValue={0}
                valueLabelDisplay="auto"
                onChange={(event: Event, newValue: number | number[]) => {
                  if (typeof newValue === "number") {
                    const newhsl = hsl;
                    newhsl[15] = newValue;
                    setHsl(newhsl);
                  }
                }}
                onChangeCommitted={() => {
                  sendRequest();
                }}
              />
              <Typography variant="caption">饱和度</Typography>
              <Slider
                min={-10}
                max={10}
                step={1}
                defaultValue={0}
                valueLabelDisplay="auto"
                onChange={(event: Event, newValue: number | number[]) => {
                  if (typeof newValue === "number") {
                    const newhsl = hsl;
                    newhsl[16] = newValue;
                    setHsl(newhsl);
                  }
                }}
                onChangeCommitted={() => {
                  sendRequest();
                }}
              />
              <Typography variant="caption">亮度</Typography>
              <Slider
                min={-10}
                max={10}
                step={1}
                defaultValue={0}
                valueLabelDisplay="auto"
                onChange={(event: Event, newValue: number | number[]) => {
                  if (typeof newValue === "number") {
                    const newhsl = hsl;
                    newhsl[17] = newValue;
                    setHsl(newhsl);
                  }
                }}
                onChangeCommitted={() => {
                  sendRequest();
                }}
              />
            </AccordionDetails>
          </Accordion>
        </Box>
        <Box sx={{}}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: "15px",
              marginRight: "55px",
            }}>
            <Stack>
              <Chip label="红色通道曲线" size="small" />
              <BezierSplineEditor
                showPoints={true}
                indicatorSpeed={100}
                width={100}
                height={100}
                points={r_curve}
                onPointsChange={setR_curve}
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
                showPoints={true}
                indicatorSpeed={100}
                width={100}
                height={100}
                points={g_curve}
                onPointsChange={setG_curve}
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
                showPoints={true}
                indicatorSpeed={100}
                width={100}
                height={100}
                points={b_curve}
                onPointsChange={setB_curve}
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
