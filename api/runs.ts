import { apiInstance } from "utils";

export interface Run {
  id: string;
  analysisStrategy?: string;
  categoryIdList?: string;
  categoryNameList: string[];
  childLength: number;
  debugChildLength: number;
  debugGrandChildLength: number;
  deviceIdList?: string | number;
  deviceNameList?: any[];
  duration: number;
  endTime: string;
  errorChildLength: number;
  errorGrandChildLength: number;
  errorParentLength: number;
  exceptionsChildLength: number;
  exceptionsGrandChildLength: number;
  exceptionsParentLength: number;
  failChildLength: number;
  failGrandChildLength: number;
  failParentLength: number;
  fatalChildLength: number;
  fatalGrandChildLength: number;
  fatalParentLength: number;
  grandChildLength: number;
  infoChildLength: number;
  infoGrandChildLength: number;
  name: string;
  parentLength: number;
  passChildLength: number;
  passGrandChildLength: number;
  passParentLength: number;
  project: string;
  projectName: string;
  skipChildLength: number;
  skipGrandChildLength: number;
  skipParentLength: number;
  startTime: string;
  status: string;
  warningChildLength: number;
  warningGrandChildLength: number;
  warningParentLength: number;
}

export const removeRun = async (id: string) =>
  await apiInstance.delete(`/rest/runs/remove/${id}`);
