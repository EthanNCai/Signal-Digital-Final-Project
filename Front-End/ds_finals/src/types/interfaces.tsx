import React, { createContext } from "react";

export type Md5 = {
  md5: string;
  onMd5Change: (md5: string) => void;
};

export interface Parameter_Dict {
  brightness: number;
  contrast: number;
  crop_arg: number[];
}

export {};

type ParameterContextType = {
  brightness: number;
  contrast: number;
  crop_arg: number[];
  setExposure: React.Dispatch<React.SetStateAction<number>>;
  setContrast: React.Dispatch<React.SetStateAction<number>>;
  sendRequest: (params?: any) => void;
  serCrop_arg: (params?: any) => void;
};
export const ParameterContext = createContext<ParameterContextType>({
  brightness: 0,
  contrast: 0,
  crop_arg: [0, 0, 0, 0],
  setExposure: () => {},
  setContrast: () => {},
  sendRequest: () => {},
  serCrop_arg: () => {},
});
