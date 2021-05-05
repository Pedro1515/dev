import { apiInstance } from "src/utils";

export const removeProject = async (id: string) =>
  await apiInstance.delete(`/rest/projects/${id}`);
