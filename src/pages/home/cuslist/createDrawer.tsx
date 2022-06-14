import { FC, useEffect, useState } from "react";
import { Button, Drawer, Form, Input, notification, Select } from "antd";
import md5 from "md5";
import { baseURL, getUrl } from "store/request";

interface IProps {
  visible: boolean;
  onClose: () => void;
  reload: () => void;
  loading: boolean;
}

const formItemLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

const { Option } = Select;

const CreateDrawer: FC<IProps> = ({ visible, onClose, reload }) => {
  const [form] = Form.useForm();
  const [allSec, setAllSec] = useState<string[]>([]);
  const getAllSec = async () => {
    const res: any = await getUrl(`${baseURL}/admin/roles`);
    setAllSec(res.data);
  };
  useEffect(() => {
    getAllSec();
  }, []);
  const onFinish = async (e: any) => {
    const payload = { ...e, password: md5(e.password) };
    const res: any = await getUrl(`${baseURL}/admin/newUser`, "POST", payload);
    if (res.status === 200) {
      form.resetFields();
      onClose();
      reload();
      notification.success({ message: "新增成功" });
    }
  };
  return (
    <Drawer
      title="新增用户"
      placement="right"
      onClose={onClose}
      visible={visible}
      width={500}
      closable={false}
    >
      <Form onFinish={onFinish} form={form}>
        <Form.Item
          {...formItemLayout}
          name="username"
          label="账号"
          rules={[
            {
              required: true,
              message: "账号不能为空!",
            },
          ]}
        >
          <Input placeholder="输入账号" />
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          name="password"
          label="密码"
          rules={[
            {
              required: true,
              message: "密码不能为空",
            },
          ]}
        >
          <Input placeholder="输入密码" />
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          name="secName"
          label="科室"
          initialValue={allSec[0]}
        >
          {!!allSec.length && (
            <Select>
              {allSec.map((item) => (
                <Option value={item} key={item}>
                  {item}
                </Option>
              ))}
            </Select>
          )}
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 20, span: 4 }}>
          <Button type="primary" htmlType="submit" style={{ marginTop: 20 }}>
            确定
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default CreateDrawer;
