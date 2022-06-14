import { FC, useState } from "react";
import "./index.less";
import { Form, Input, Button, notification } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setCookie } from "storage";
import { baseURL } from "store/request";
import md5 from "md5";
interface IProps {
  refresh: Function;
}
const Index: FC<IProps> = ({ refresh }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  // 账号密码提交
  const onFinish = (values: any) => {
    const { username, password } = values;
    login(username, password);
  };
  // 登录接口
  const login = async (username: string, password: string) => {
    setLoading(true);
    const url = `${baseURL}/admin/login`;
    const res = axios({
      method: "POST",
      url,
      data: { username, password },
    })
      .then(async (e) => {
        console.log(e);

        if (e.status === 200) {
          await setCookie("hos-admin", e.data, 7);
          // await saveToken(e.data);
          refresh();
          navigate("/home");
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        if (err.response.status === 400 || err.response.status === 500) {
          notification.error({ message: "账号密码不正确" });
        }
        if (!err.response) {
          notification.error({ message: "请求已超时" });
        }
      });
    setTimeout(() => {
      setLoading(false);
    }, 20000);
    // setLoading(false);
    // if (res.status === 200) {
    //   return res.data;
    // }
    return null;
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 100,
      }}
    >
      <h1 style={{ color: "#4188e7" }}>带检查预约安排管理系统 -- 后台</h1>
      <Form
        name="basic"
        wrapperCol={{ span: 24 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
        className="login-form"
      >
        <Form.Item
          label="用户名"
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="密码"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button type="primary" htmlType="submit" loading={loading}>
            登录
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default Index;
