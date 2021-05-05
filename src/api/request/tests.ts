import { apiInstance } from "src/utils";

interface PostRequest {
  id: string;
  errorStates: string[];
}

export const updateTest = async (request: PostRequest) => {
  let response = await apiInstance.post("/rest/tests/update", request)
  const { errorStates } = response?.data
  const { status } = response
  return { errorStates, status }
}
