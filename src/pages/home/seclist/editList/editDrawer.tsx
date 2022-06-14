import { FC, useEffect, useState } from "react";
import {
  Button,
  Drawer,
  Form,
  Input,
  InputNumber,
  notification,
  Select,
} from "antd";
import { baseURL, getUrl } from "store/request";

interface IProps {
  visible: boolean;
  onClose: () => void;
  reload: () => void;
  loading: boolean;
  data: any;
  secName: string;
}

const formItemLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

const { Option } = Select;

const CreateDrawer: FC<IProps> = ({
  visible,
  onClose,
  reload,
  data,
  secName,
}) => {
  const [form] = Form.useForm();
  const [allSec, setAllSec] = useState<string[]>([]);
  const [fullTime, setFullTime] = useState<boolean>(true);
  const getAllSec = async () => {
    const res: any = await getUrl(`${baseURL}/admin/roles`);
    setAllSec(res.data);
  };
  useEffect(() => {
    const { startTime, max } = data;
    form.setFieldsValue({ secName, startTime, max });
    setFullTime(startTime && startTime.trim() === "-1");
    getAllSec();
    return () => {
      setFullTime(true);
      form.resetFields();
    };
  }, [data]);
  const onFinish = async (e: any) => {
    const res: any = await getUrl(`${baseURL}/admin/setMax`, "POST", e);
    console.log(res);

    if (res.status === 200) {
      form.resetFields();
      onClose();
      reload();
      notification.success({ message: "success" });
    }
  };
  return (
    <Drawer
      title="修改科室最大检查能力"
      placement="right"
      onClose={onClose}
      visible={visible}
      width={500}
      closable={false}
    >
      <Form onFinish={onFinish} form={form}>
        <Form.Item {...formItemLayout} name="secName" hidden>
          <Input />
        </Form.Item>
        <Form.Item {...formItemLayout} label="时间段类型">
          <Select onChange={setFullTime} value={fullTime}>
            <Option value={true}>全时间段</Option>
            <Option value={false}>可选时间段</Option>
          </Select>
        </Form.Item>
        {!fullTime && (
          <Form.Item {...formItemLayout} name="startTime" label="时间段">
            <Select>
              <Option value={"0800"}>8:00-9:00</Option>
              <Option value={"0900"}>9:00-10:00</Option>
              <Option value={"1000"}>10:00-11:00</Option>
              <Option value={"1100"}>11:00-12:00</Option>
              <Option value={"1400"}>14:00-14:30</Option>
              <Option value={"1430"}>14:30-15:30</Option>
              <Option value={"1530"}>15:30-16:30</Option>
              <Option value={"1630"}>16:30-17:30</Option>
            </Select>
          </Form.Item>
        )}
        <Form.Item
          {...formItemLayout}
          name="max"
          label="最大检查能力"
          rules={[
            {
              required: true,
              message: "Cannot be empty!",
            },
          ]}
        >
          <InputNumber />
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
