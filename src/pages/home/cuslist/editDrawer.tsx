import { FC, useEffect } from "react";
import { Button, Drawer, Form, Input, notification } from "antd";
import md5 from "md5";
import { baseURL, getUrl } from "store/request";

interface IProps {
  visible: boolean;
  onClose: () => void;
  reload: () => void;
  loading: boolean;
  data: any;
}
const formItemLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
const EditDrawer: FC<IProps> = ({ visible, onClose, reload, data }) => {
  const [form] = Form.useForm();
  useEffect(() => form.setFieldsValue(data), [data, form]);
  const onFinish = async (e: { username: string; password: string }) => {
    const res: any = await getUrl(`${baseURL}/admin/modifyPwd`, "PUT", {
      username: e.username,
      password: md5(e.password),
    });
    if (res.status) {
      form.resetFields();
      onClose();
      reload();
      notification.success({ message: "修改密码成功" });
    }
  };
  return (
    <Drawer
      title="修改用户密码"
      placement="right"
      onClose={onClose}
      visible={visible}
      width={700}
      closable={false}
      getContainer={false}
    >
      <Form onFinish={onFinish} form={form}>
        <Form.Item hidden name="username">
          <Input />
        </Form.Item>
        <Form.Item {...formItemLayout} name="password" label="修改">
          <Input />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 20, span: 4 }}>
          <Button className="default-button" type="primary" htmlType="submit">
            提交
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default EditDrawer;
