import { apiInstance } from "src/utils";
import Cookies from "js-cookie";
import { User } from "../models"
import { JWT } from "../models"

export const getCurrentUser = async () =>
  await apiInstance.get<User>("/rest/user/me");

export const login = async (username: string, password: string) =>
  await apiInstance.post<JWT>(`/user/authenticate`, null, {
    params: { username, password },
  });
