import { apiInstance } from "src/utils";

export const getMedias = async (id: string) => {
  let response = await apiInstance.get('/rest/tests/media/'+id);
  return  response.data[0].base64String
}
