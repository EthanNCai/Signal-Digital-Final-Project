import React, { createContext } from "react";

export type Md5 = {
  md5: string;
  onMd5Change: (md5: string) => void;
};

export interface Parameter_Dict {
  brightness: number;
  contrast: number;
}

export {};

type ParameterContextType = {
  exposure: number;
  contrast: number;
  setExposure: React.Dispatch<React.SetStateAction<number>>;
  setContrast: React.Dispatch<React.SetStateAction<number>>;
  sendRequest: (params?: any) => void;
};
export const ParameterContext = createContext<ParameterContextType>({
  exposure: 0,
  contrast: 0,
  setExposure: () => {},
  setContrast: () => {},
  sendRequest: () => {},
});
