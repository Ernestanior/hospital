import { FC, useEffect, useState } from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Table,
} from "antd";
import { MedModal } from "components/modal";
import moment from "moment";
import { baseURL, getUrl } from "store/request";
import Loading from "components/loading/context";
import { onSelect } from "hook/useDetail";
import "./index.less";
const { RangePicker } = DatePicker;
const { Option } = Select;
const range = 30 * 24 * 60 * 60 * 1000;
const now = +new Date();
const start = moment(now - range);
const end = moment(now);

interface IProps {
  reload: boolean;
}
const Index: FC<IProps> = ({ reload }) => {
  const [searchFlag, setSearchFlag] = useState<boolean>(false);
  const [currData, setCurrData] = useState<any[]>([]);
  const [selectIndex, setSelectIndex] = useState<number>(0);
  const [pageNum, setPage] = useState<number>(1);
  const [params, setParams] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [dataNum, setDataNum] = useState<number>(0);

  const onSearch = async (payload: any) => {
    setLoading(true);
    setPage(1);
    const { checkStatus, checkType, date, inHosNo, patientName, medAdvStatus } =
      payload;
    const from = payload.date[0].format("YYYY-MM-DD HH:mm:ss");
    const to = payload.date[1].format("YYYY-MM-DD HH:mm:ss");
    const newPayload = {
      checkStatus,
      from,
      to,
      pageNum: 1,
      pageSize: 18,
      checkType,
      inHosNo,
      patientName,
      medAdvStatus,
    };
    const res: any = await getUrl(
      `${baseURL}/physical/query`,
      "POST",
      newPayload
    );
    setDataNum(res.data.length);
    setParams(newPayload);
    setLoading(false);
    if (res.status === 200) {
      setCurrData(res.data);
      setSearchFlag(false);
    }
  };
  const columns: any = [
    {
      title: "姓名",
      dataIndex: "patientName",
      key: "patientName",
      width: 80,
      fixed: "left",
    },
    {
      title: "科室",
      dataIndex: "applySec",
      key: "applySec",
      width: 90,
    },
    {
      title: "检查项目",
      dataIndex: "checkDesc",
      key: "checkDesc",
      width: 250,
    },
    {
      title: "安排时间",
      dataIndex: "arrangeTime",
      key: "arrangeTime",
      width: 230,
    },
    {
      title: "带检查人",
      dataIndex: "guide",
      key: "guide",
      width: 80,
    },
  ];
  useEffect(() => {
    params && onPage(pageNum);
  }, [pageNum, reload]);
  const onPage = async (pageNum: number) => {
    setLoading(true);
    const res: any = await getUrl(`${baseURL}/physical/query`, "POST", {
      ...params,
      pageNum,
    });
    setCurrData(res.data);
    setLoading(false);
  };
  const goPrev = async () => {
    setPage(pageNum - 1);
  };
  const goNext = async () => {
    setPage(pageNum + 1);
  };
  return (
    <div className="leftTable" style={{ padding: 10, width: 570 }}>
      <Loading display={loading}></Loading>
      <Table
        columns={columns}
        dataSource={currData}
        bordered
        size="middle"
        pagination={false}
        rowKey="medAdvId"
        scroll={{ x: 570 }}
        onRow={(record, index: any) => ({
          onClick: () => {
            setSelectIndex(index);
            onSelect(record);
          },
        })}
        rowClassName={(record, index) => {
          return index === selectIndex ? "row-active" : "row-normal";
        }}
        style={{ minHeight: 700 }}
      />
      <section
        style={{
          marginTop: 20,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Button type="primary" onClick={() => setSearchFlag(true)}>
          搜索
        </Button>
        <div>
          {pageNum >= 2 && <Button onClick={() => goPrev()}>上一页</Button>}
          {dataNum >= 10 && (
            <Button onClick={() => goNext()} style={{ marginLeft: 20 }}>
              下一页
            </Button>
          )}
        </div>
      </section>
      <MedModal
        visible={searchFlag}
        onOk={(e) => onSearch(e)}
        onCancel={() => setSearchFlag(false)}
        title="筛选"
      >
        <Form.Item name="date" label="日期" initialValue={[start, end]}>
          <RangePicker showTime={true} style={{ width: 400 }} />
        </Form.Item>
        <Form.Item label="安排状态" name="checkStatus" initialValue={"未安排"}>
          <Select>
            <Option value={"未安排"}>未安排</Option>
            <Option value={"已安排"}>已安排</Option>
            <Option value={"全部"}>全部</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="医嘱执行状态"
          name="medAdvStatus"
          initialValue={"未执行"}
        >
          <Select>
            <Option value={"未执行"}>未执行</Option>
            <Option value={"正在执行"}>正在执行</Option>
            <Option value={"完全执行"}>完全执行</Option>
            <Option value={"拒绝执行"}>拒绝执行</Option>
            <Option value={"全部"}>全部</Option>
          </Select>
        </Form.Item>
        <Form.Item label="检查类型" name="checkType">
          <Input></Input>
        </Form.Item>
        <Form.Item label="住院号" name="inHosNo">
          <InputNumber style={{ width: 300 }}></InputNumber>
        </Form.Item>
        <Form.Item label="病人姓名" name="patientName">
          <Input></Input>
        </Form.Item>
      </MedModal>
    </div>
  );
};

export default Index;
