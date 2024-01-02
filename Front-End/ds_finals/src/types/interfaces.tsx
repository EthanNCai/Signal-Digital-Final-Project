import React, { createContext } from "react";

export type Md5 = {
  md5: string;
  onMd5Change: (md5: string) => void;
};

export interface Parameter_Dict {
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
  setExposure: React.Dispatch<React.SetStateAction<number>>;
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
  setExposure: () => {},
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
});
