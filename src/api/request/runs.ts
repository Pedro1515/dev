import { apiInstance } from "src/utils";

export const removeRun = async (id: string) =>
  await apiInstance.delete(`/rest/runs/remove/${id}`);
