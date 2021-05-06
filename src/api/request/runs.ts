import { apiInstance } from "src/utils";

export const removeRun = async (id: string) => { 
  let response = await apiInstance.delete(`/rest/runs/remove/${id}`); 
  return response.status
}
