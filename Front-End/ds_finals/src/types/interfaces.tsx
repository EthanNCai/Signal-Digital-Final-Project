import React, { createContext } from "react";

export type Md5 = {
  md5: string;
  onMd5Change: (md5: string) => void;
};

export interface Parameter_Dict {
  exposure_contrast: number;
  exposure_brightness: number;
  beauty: boolean;
  histeq: boolean;
  left_turn: boolean;
  right_turn: boolean;
  text: string;
  dotext: boolean;
  position: number[];
  hsl: number[];
  hue: number;
  smooth: number;
  temperature: number;
  sharp: number;
  saturation: number;
  brightness: number;
  contrast: number;
  crop_arg: number[];
  crop: boolean;
  r_curve: number[];
  g_curve: number[];
  b_curve: number[];
}

export {};
type Point = {
  x: number;
  y: number;
};
type ParameterContextType = {
  imageurl: string;
  r_curve: Point[];
  g_curve: Point[];
  b_curve: Point[];
  dotext: boolean;
  crop: boolean;
  isPreviewText: boolean;
  isPreviewCrop: boolean;
  hue: number;
  smooth: number;
  temperature: number;
  sharp: number;
  saturation: number;
  brightness: number;
  contrast: number;
  crop_arg: number[];
  exposure_contrast: number;
  exposure_brightness: number;
  beauty: boolean;
  histeq: boolean;
  left_turn: boolean;
  right_turn: boolean;
  text: string;
  position: number[];
  hsl: number[];
  setBrightness: React.Dispatch<React.SetStateAction<number>>;
  setContrast: React.Dispatch<React.SetStateAction<number>>;
  sendRequest: (params?: any) => void;
  serCrop_arg: (params?: any) => void;
  setHue: (params?: any) => void;
  setSmooth: (params?: any) => void;
  setTemperature: (params?: any) => void;
  setSharp: (params?: any) => void;
  setSaturation: (params?: any) => void;
  setIsPreviewText: (params?: any) => void;
  setIsPreviewCrop: (params?: any) => void;
  setCrop: (params?: any) => void;
  setDotext: (params?: any) => void;
  setR_curve: (params?: any) => void;
  setG_curve: (params?: any) => void;
  setB_curve: (params?: any) => void;
  setExposure_contrast: (params?: any) => void;
  setExposure_brightness: (params?: any) => void;
  setBeauty: (params?: any) => void;
  setHisteq: (params?: any) => void;
  setLeft_turn: (params?: any) => void;
  setRight_turn: (params?: any) => void;
  setText: (params?: any) => void;
  setPosition: (params?: any) => void;
  setHsl: (params?: any) => void;
};
export const ParameterContext = createContext<ParameterContextType>({
  r_curve: [
    { x: 0, y: 0 },
    { x: 0.25, y: 0.25 },
    { x: 0.75, y: 0.75 },
    { x: 1, y: 1 },
  ],
  g_curve: [
    { x: 0, y: 0 },
    { x: 0.25, y: 0.25 },
    { x: 0.75, y: 0.75 },
    { x: 1, y: 1 },
  ],
  b_curve: [
    { x: 0, y: 0 },
    { x: 0.25, y: 0.25 },
    { x: 0.75, y: 0.75 },
    { x: 1, y: 1 },
  ],
  imageurl: "",
  dotext: false,
  crop: false,
  isPreviewText: false,
  isPreviewCrop: false,
  hue: 0,
  smooth: 0,
  temperature: 0,
  sharp: 0,
  saturation: 0,
  brightness: 0,
  contrast: 0,
  crop_arg: [0, 0, 0, 0],
  exposure_contrast: 0,
  exposure_brightness: 0,
  beauty: false,
  histeq: false,
  left_turn: false,
  right_turn: false,
  text: "",
  position: [],
  hsl: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  setBrightness: () => {},
  setContrast: () => {},
  sendRequest: () => {},
  serCrop_arg: () => {},
  setHue: () => {},
  setSmooth: () => {},
  setTemperature: () => {},
  setSharp: () => {},
  setSaturation: () => {},
  setIsPreviewText: () => {},
  setIsPreviewCrop: () => {},
  setCrop: () => {},
  setDotext: () => {},
  setR_curve: () => {},
  setG_curve: () => {},
  setB_curve: () => {},
  setExposure_contrast: () => {},
  setExposure_brightness: () => {},
  setBeauty: () => {},
  setHisteq: () => {},
  setLeft_turn: () => {},
  setRight_turn: () => {},
  setText: () => {},
  setPosition: () => {},
  setHsl: () => {},
});
