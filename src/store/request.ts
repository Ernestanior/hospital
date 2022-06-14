import { notification } from "antd";
import axios from "axios";
import { resolve } from "path";
import { getCookie } from "storage";

export const baseURL = "http://221.195.40.83:12350/hospital";
// 接口请求封装
export const getUrl = (
  url: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  data: any = {}
) => {
  return axios({
    method: method,
    url,
    headers: { AUTH: getCookie("hos-cus") || "" },
    data,
  })
    .then((result) => {
      return result;
    })
    .catch((err) => {
      console.log(err);
      if (err.response.status === 500) {
        notification.error({ message: "服务器故障" });
      } else if (err.response.status === 403) {
        notification.error({ message: "账号密码不正确" });
      }
      if (!err.response) {
        notification.error({ message: "请求已超时" });
      }
    });
};
