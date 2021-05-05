interface Machine {
  timestamp: number;
  machineIdentifier: number;
  processIdentifier: number;
  counter: number;
  date: string;
  time: number;
  timeSecond: number;
}

interface Media {
  id: string;
  test: Machine;
  log: Machine;
  project: Machine;
  report: Machine;
  sequence: number;
  testName: string;
  path: string;
  updatedAt: string;
  mediaType: string;
  base64String: string;
  fileExtension: string;
}

interface Log {
  id: string;
  project: string;
  report: string;
  test: string;
  testName: string;
  sequence: number;
  status: string;
  details: string;
  exception: string;
  stacktrace: string;
  timestamp: string;
  media: Media[];
}

export interface Feature {
  id: string;
  parent: Machine;
  project: Machine;
  report: Machine;
  reportName: string;
  level: number;
  name: string;
  status: string;
  bdd: boolean;
  bddType: string;
  childNodesLength: number;
  duration: any;
  leaf: boolean;
  endTime: string;
  startTime: string;
  description: string;
  categorized: boolean;
  logs: Log[];
  media: Media[];
  categoryNameList: string[];
  deviceNameList: string[];
  authorNameList: string[];
  errorStates: string[];
}

export interface Test {
  id:string, 
  name:string, 
  nodes:[],
  errorStates:string[],
}