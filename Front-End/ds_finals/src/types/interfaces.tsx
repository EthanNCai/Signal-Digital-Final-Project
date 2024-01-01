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
}

export {};

type ParameterContextType = {
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
};
export const ParameterContext = createContext<ParameterContextType>({
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
});
