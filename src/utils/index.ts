export * from "./hooks";
export * from "./axios";
export * from "./date";
export * from "./number";
export * from "./string";
export * from "./runs";
export * from "./swr";

export const callAll = (...fns) => (...args) =>
  fns.forEach((fn) => fn?.(...args));

export const noop = () => {};
