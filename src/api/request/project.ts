import { apiInstance } from "src/utils";

export const removeProject = async (id: string) => { 
  let response = await apiInstance.delete(`/rest/projects/${id}`); 
  return response.status
}