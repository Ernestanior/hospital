import { FC, useEffect, useState } from "react";
import { Table } from "antd";
import { baseURL, getUrl } from "store/request";
import { onSelect } from "hook/useDetail";
import { reConvertTime } from "storage";
import { useDateTime } from "hook/useDateTime";
import "./index.less";
import { from } from "rxjs";

interface IProps {
  reload: boolean;
}
const Index: FC<IProps> = ({ reload }) => {
  const [currData, setCurrData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectIndex, setSelectIndex] = useState<number>(0);
  const [dateData, timeData] = useDateTime();
  useEffect(() => {
    if (dateData && timeData) {
      from(
        getUrl(
          `${baseURL}/physical/getInfoByDateTime?date=${reConvertTime(
            dateData
          )}&time=${timeData}`
        )
      ).subscribe((res: any) => {
        setCurrData(res.data);
      });
    }
    return () => setSelectIndex(-1);
  }, [dateData, timeData, reload]);
  const columns: any = [
    {
      title: "姓名",
      dataIndex: "patientName",
      key: "patientName",
      width: 60,
      fixed: "left",
    },
    {
      title: "带检查人",
      dataIndex: "guide",
      key: "guide",
      width: 60,
    },
    {
      title: "执行间",
      dataIndex: "execRoom",
      key: "execRoom",
      width: 60,
    },
    {
      title: "项目",
      dataIndex: "checkDesc",
      key: "checkDesc",
      width: 200,
    },
  ];

  return (
    <div className="tableTwo" style={{ width: 460 }}>
      <Table
        style={{ width: 460 }}
        columns={columns}
        dataSource={currData}
        bordered
        loading={loading}
        size="middle"
        pagination={false}
        rowKey="medAdvId"
        onRow={(record: any, index: any) => ({
          onClick: async () => {
            setLoading(true);
            const res: any = await getUrl(
              `${baseURL}/physical/getInfoById/${record.medAdvId}`
            );
            setLoading(false);
            onSelect(res.data);
            setSelectIndex(index);
          },
        })}
        rowClassName={(record, index) => {
          return index === selectIndex ? "row-active" : "row-normal";
        }}
      />
    </div>
  );
};

export default Index;
