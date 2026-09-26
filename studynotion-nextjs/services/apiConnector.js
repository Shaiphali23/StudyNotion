import axios from "axios";
export const axiosInstance = axios.create({ withCredentials: true });

export const apiConnector = (method, url, bodyData, headers, params) => {
  let authHeaders = {};
  try {
    if (typeof window !== "undefined") {
      const token = JSON.parse(localStorage.getItem("token") ?? "null");
      if (token) authHeaders.Authorization = `Bearer ${token}`;
    }
  } catch {}
  return axiosInstance({
    method: `${method}`,
    url: `${url}`,
    data: bodyData ? bodyData : null,
    headers: { ...authHeaders, ...(headers ? headers : null) },
    params: params ? params : null,
    withCredentials: true,
  });
};