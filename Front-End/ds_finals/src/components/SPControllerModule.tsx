import {
  Box,
  Button,
  Slider,
  Chip,
  IconButton,
  ButtonGroup,
  TextField,
  Typography,
} from "@mui/material";
import { Md5 } from "../types/interfaces";
import * as React from "react";
import { Download, GitHub, Home } from "@mui/icons-material";
import UploadModule from "./UploadModule";
import { useContext } from "react";
import { ParameterContext } from "../types/interfaces";
import { text } from "stream/consumers";
import { useState, ChangeEvent } from "react";
const SPControllerModule: React.FC<Md5> = ({ md5, onMd5Change }) => {
  const {
    crop,
    dotext,
    isPreviewText,
    isPreviewCrop,
    crop_arg,
    text,
    serCrop_arg,
    setIsPreviewText,
    setIsPreviewCrop,
    setCrop,
    setDotext,
    setText,
    sendRequest,
    position,
    setPosition,
  } = useContext(ParameterContext);
  const handleyChange = (event: Event, newValue: number | number[]) => {
    const modifiedNumber = newValue as number[];
    const outputnumber = [0, 0, 0, 0];
    outputnumber[0] = crop_arg[0]; //x1
    outputnumber[1] = modifiedNumber[0]; //y1
    outputnumber[2] = crop_arg[2]; //x2
    outputnumber[3] = modifiedNumber[1]; //y2
    serCrop_arg(outputnumber);
  };
  const handlexChange = (event: Event, newValue: number | number[]) => {
    const modifiedNumber = newValue as number[];
    const outputnumber = [0, 0, 0, 0];
    outputnumber[0] = modifiedNumber[0]; //x1
    outputnumber[1] = crop_arg[1]; //y1
    outputnumber[2] = modifiedNumber[1]; //x2
    outputnumber[3] = crop_arg[3]; //y2
    serCrop_arg(outputnumber);
  };
  const handleTextXChange = (event: Event, newValue: number | number[]) => {
    const modifiesNumber = newValue as number;
    const outputnumber = [0, 0];
    outputnumber[0] = modifiesNumber;
    outputnumber[1] = position[1];
    setPosition(outputnumber);
  };
  const handleTextYChange = (event: Event, newValue: number | number[]) => {
    const modifiesNumber = newValue as number;
    const outputnumber = [0, 0];
    outputnumber[1] = modifiesNumber;
    outputnumber[0] = position[0];
    setPosition(outputnumber);
  };

  const handleText = (event: ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  const xl = crop_arg[0];
  const yl = crop_arg[1];
  const xr = crop_arg[2];
  const yr = crop_arg[3];
  return (
    <>
      <Box sx={{ margin: "30px" }}>
        <Box marginX={"10px"}>
          <Chip label="裁切" />

          <Box sx={{ minWidth: "70%", marginY: "17px" }}>
            <Typography fontSize={"small"}>横向</Typography>
            <Slider
              getAriaLabel={() => "Temperature range"}
              value={[xl, xr]}
              onChange={handlexChange}
              valueLabelDisplay="auto"
              min={0}
              max={100}
            />
            <Typography fontSize={"small"}>纵向</Typography>
            <Slider
              getAriaLabel={() => "Temperature range"}
              value={[yl, yr]}
              onChange={handleyChange}
              valueLabelDisplay="auto"
              min={0}
              max={100}
            />

            <Button
              variant="contained"
              onClick={() => {
                setCrop(!crop);
                if (isPreviewCrop) {
                  setIsPreviewCrop(false);
                }
              }}>
              {crop ? "取消应用" : "应用"}
            </Button>
            <Button
              color={isPreviewCrop ? "error" : "primary"}
              onClick={() => {
                setIsPreviewCrop(!isPreviewCrop);
              }}>
              {isPreviewCrop ? "关闭预览" : "预览裁切"}
            </Button>
          </Box>

          <TextField
            sx={{ marginY: "10px" }}
            label="添加文字"
            variant="outlined"
            size="small"
            value={text}
            onChange={handleText}
          />

          <Box sx={{ minWidth: "70%", marginY: "17px" }}>
            <Typography fontSize={"small"}>纵向位置</Typography>
            <Slider
              value={position[1]}
              onChange={handleTextYChange}
              valueLabelDisplay="auto"
              min={0}
              max={100}
              step={1}
            />
            <Typography fontSize={"small"}>横向位置</Typography>
            <Slider
              value={position[0]}
              onChange={handleTextXChange}
              valueLabelDisplay="auto"
              min={0}
              max={100}
              step={1}
            />
          </Box>

          <Button
            variant="contained"
            color="warning"
            onClick={() => {
              setDotext(!dotext);
            }}>
            {dotext ? "取消应用" : "应用"}
          </Button>
          <Button
            color={isPreviewText ? "error" : "warning"}
            onClick={() => {
              setIsPreviewText(!isPreviewText);
            }}>
            {isPreviewText ? "关闭预览" : "预览文字位置"}
          </Button>
        </Box>
        <Box sx={{ marginTop: "20px" }}>
          <Button sx={{ margin: "5px" }} variant="contained">
            直方图均衡化
          </Button>
          <Button sx={{ margin: "5px" }} variant="contained">
            自动美颜
          </Button>
          <ButtonGroup>
            <Button variant="outlined">左转</Button>
            <Button variant="outlined">右转</Button>
          </ButtonGroup>
        </Box>
        <Box sx={{ marginTop: "10px" }}>
          <UploadModule md5={md5} onMd5Change={onMd5Change} />
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
};

export default SPControllerModule;
