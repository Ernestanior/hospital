import { FC, useEffect, useState } from "react";
import { Button, Form, Input, notification, Select } from "antd";
import { useDetail } from "hook/useDetail";
import { useForm } from "antd/lib/form/Form";
import { convertTime, getCookie } from "storage";
import "./index.less";
import { baseURL, getUrl } from "store/request";
import { useTime } from "hook/useTime";
import { useDate } from "hook/useDate";

const { Option } = Select;
interface IProps {
  reload: () => void;
}
// const type = getCookie("hos-cus-sec");

const Index: FC<IProps> = ({ reload }) => {
  const [loading, setLoading] = useState<boolean>(false);
  // const [selectTime, setSelectTime] = useState<string>("");
  const [type, setType] = useState<any>();
  const [finalDate, setFinalDate] = useState<string>("");
  const [guideList, setGuideList] = useState<any[]>();
  const [valid, setValid] = useState<boolean>(true);
  const [form] = useForm();
  const selectData = useDetail();
  const [dateData, timeData] = useTime();
  const selectDate = useDate();
  console.log(guideList);

  useEffect(() => {
    selectData && form.setFieldsValue(selectData);
    return () => {
      form.resetFields();
      setValid(true);
    };
  }, [selectData, form]);

  useEffect(() => {
    if (type === "带检查人") {
      getGuides();
    }
  }, [type]);

  useEffect(() => {
    setFinalDate(dateData);
  }, [dateData]);

  useEffect(() => {
    setType(getCookie("hos-cus-sec"));
  }, [getCookie("hos-cus-sec")]);
  useEffect(() => {
    setFinalDate(convertTime(selectDate));
  }, [selectDate]);
  // useEffect(() => {
  //   if (selectDate) {
  //     form.setFieldsValue({ arrangeTime: selectDate });
  //   }
  // }, [selectDate]);

  const getGuides = async () => {
    const res: any = await getUrl(`${baseURL}/user/guides`);
    setGuideList(res.data);
  };
  const checkValid = (e: string) => {
    // timeData
    const max = e.split("&&")[1];
    const cnt = e.split("&&")[2];
    if (parseInt(cnt) < parseInt(max)) {
      // setSelectTime(convertTime(e.split("&&")[0]));
      setValid(true);
    } else {
      setValid(false);
      notification.error({
        message: "该时间段已达最大检查能力，请选择其他时间段",
      });
    }
  };
  const timeDisplay = (time: string) => {
    switch (time) {
      case "0800":
        return "08:00-09:00";
      case "1400":
        return "14:00-14:30";
      default:
        const end = parseInt(time) + 100;
        return `${convertTime(time)}-${convertTime(end + "")}`;
    }
  };
  const onEdit = async (e: any) => {
    if (!valid) {
      notification.error({
        message: "该时间段已达最大检查能力，请选择其他时间段",
      });
      return null;
    }
    if (e.status === "完全执行") {
      notification.error({ message: "完全执行状态下，不可进行修改操作" });
      return null;
    }
    if (type === "带检查人") {
      if (e.guide && e.arrangeTime && e.status && e.medAdvId && e.execRoom) {
        setLoading(true);
        await getUrl(
          `${baseURL}/physical/update?id=${e.medAdvId}&&guideId=${e.guide}`,
          "PUT"
        );
        setLoading(false);
        notification.success({ message: "修改成功" });
        reload();
        return;
      }
      notification.error({ message: "修改失败，未达到修改权限或条件" });
      return;
    } else {
      if (e.arrangeTime && e.status && e.medAdvId && e.execRoom) {
        setLoading(true);
        let time =
          e.arrangeTime.indexOf("&&") === -1
            ? e.arrangeTime
            : `${finalDate} ${convertTime(e.arrangeTime.slice(0, 4))}:00`;

        // const time = convertTime(selectDate) + " " + selectTime + ":00";
        await getUrl(
          `${baseURL}/physical/arrange?id=${e.medAdvId}&time=${time}&note=${e.execRoom}`,
          "POST"
        );
        setLoading(false);
        notification.success({ message: "修改成功" });
        reload();
        return;
      }
      notification.error({ message: "修改失败，未达到修改权限或条件" });
      return;
    }
  };
  return (
    <div style={{ padding: "10px 20px 5px 0", width: 800 }}>
      <Form
        form={form}
        onFinish={onEdit}
        className="detail-form"
        style={{
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        <Form.Item
          name="patientName"
          style={{ flex: "30%", marginRight: 20 }}
          label="病人姓名"
        >
          <Input readOnly />
        </Form.Item>
        <Form.Item
          name="age"
          style={{ flex: "30%", marginRight: 20 }}
          label="年龄"
        >
          <Input readOnly />
        </Form.Item>
        <Form.Item name="gender" label="性别" style={{ flex: "30%" }}>
          <Input readOnly />
        </Form.Item>
        <Form.Item
          name="inHosNo"
          label="住院号"
          style={{ flex: "30%", marginRight: 20 }}
        >
          <Input readOnly />
        </Form.Item>
        <Form.Item
          name="applySec"
          label="申请科室"
          style={{ flex: "30%", marginRight: 20 }}
        >
          <Input readOnly />
        </Form.Item>
        <Form.Item name="applyTime" label="申请时间" style={{ flex: "30%" }}>
          <Input readOnly />
        </Form.Item>

        <Form.Item
          name="bedNo"
          label="床号"
          style={{ flex: "30%", marginRight: 20 }}
        >
          <Input readOnly />
        </Form.Item>
        <Form.Item
          name="checkType"
          label="检查类型"
          style={{ flex: "30%", marginRight: 20 }}
        >
          <Input readOnly />
        </Form.Item>
        <Form.Item name="checkDesc" label="检查项目" style={{ flex: "30%" }}>
          <Input readOnly />
        </Form.Item>
        <Form.Item
          name="status"
          label="执行状态"
          style={{ flex: "30%", marginRight: 20 }}
        >
          <Input readOnly />
        </Form.Item>
        <Form.Item
          name="docName"
          label="开单医生"
          style={{ flex: "30%", marginRight: 20 }}
        >
          <Input readOnly />
        </Form.Item>

        <Form.Item name="isInHos" label="是否在院" style={{ flex: "30%" }}>
          <Input readOnly />
        </Form.Item>
        <Form.Item
          name="medAdvId"
          label="医嘱id"
          style={{ flex: "30%", marginRight: 20 }}
        >
          <Input readOnly />
        </Form.Item>
        <Form.Item
          name="medAdvStatus"
          label="医嘱状态"
          style={{ flex: "30%", marginRight: 20 }}
        >
          <Input readOnly />
        </Form.Item>
        <Form.Item name="medAdvice" label="医生嘱托" style={{ flex: "30%" }}>
          <Input readOnly />
        </Form.Item>
        <Form.Item name="diagnosis" label="住院诊断" style={{ flex: "80%" }}>
          <Input readOnly />
        </Form.Item>

        <Form.Item
          label={<div style={{ fontSize: 20, color: "#438af1" }}>带检查人</div>}
          className={type === "带检查人" ? "able" : ""}
          name="guide"
          style={{ flex: "25%", marginRight: 20 }}
        >
          <Select>
            {guideList &&
              guideList.map((item: any) => (
                <Option value={item.username}>{item.username}</Option>
              ))}
          </Select>
        </Form.Item>
        <Form.Item
          label={<div style={{ fontSize: 20, color: "#438af1" }}>执行间</div>}
          className={type !== "带检查人" ? "able" : ""}
          name="execRoom"
          style={{ flex: "20%", marginRight: 20 }}
        >
          <Input readOnly={type === "带检查人"} />
        </Form.Item>
        <Form.Item
          label={<div style={{ fontSize: 20, color: "#438af1" }}>安排时间</div>}
          className={type !== "带检查人" ? "able" : ""}
          name="arrangeTime"
          style={{ flex: "35%", marginRight: 20 }}
        >
          {/* <Input readOnly /> */}
          <Select onChange={checkValid} disabled={type === "带检查人"}>
            {timeData &&
              timeData.map((item: any) => (
                <Option
                  key={item.startTime}
                  value={`${item.startTime}&&${item.max}&&${item.cnt}`}
                >
                  {finalDate + " " + timeDisplay(item.startTime)}
                </Option>
              ))}
          </Select>
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          确认
        </Button>
      </Form>
    </div>
  );
};

export default Index;
