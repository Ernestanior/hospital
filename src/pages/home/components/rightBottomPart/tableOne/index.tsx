import { FC, useEffect, useMemo, useState } from "react";
import { Button, DatePicker, Select, Table } from "antd";
import { baseURL, getUrl } from "store/request";
import { convertTime, eraseCookie, getCookie, reConvertTime } from "storage";
import { onSelectTime } from "hook/useTime";
import "./index.less";
import { onSelectDateTime } from "hook/useDateTime";
import { useDate } from "hook/useDate";
import moment from "moment";
import { useNavigate } from "react-router-dom";
const type = getCookie("hos-cus-sec");

const { Option } = Select;

interface IProps {
  reload: boolean;
}
const Index: FC<IProps> = ({ reload }) => {
  const navigate = useNavigate();
  const selectDate = useDate();
  const [currData, setCurrData] = useState<any>([]);
  const [max, setMax] = useState<any>([]);
  const [defaultMax, setDefaultMax] = useState<any>([]);
  const [date, setDate] = useState<any>(moment(new Date()));
  const [loading, setLoading] = useState<boolean>(false);
  const [onSwitch, setOnSwitch] = useState<boolean>(false);
  const [selectIndex, setSelectIndex] = useState<number>(0);
  const [secName, setSecName] = useState<string>(
    type === "带检查人" ? "全部" : ""
  );
  const [refresh, setRefresh] = useState<boolean>(false);

  const getSecMax = async () => {
    const res: any = await getUrl(`${baseURL}/physical/secMax`);
    setMax(res.data);
    res.data.forEach((item: any) => {
      item.startTime === "-1" && setDefaultMax(item.max);
    });
  };
  const selectInput = useMemo(() => {
    return (
      type === "带检查人" && (
        <Select
          defaultValue={"全部"}
          style={{ width: 70, marginRight: 10 }}
          onChange={setSecName}
        >
          <Option value="全部">全部</Option>
          <Option value="彩超">彩超</Option>
          <Option value="CT">CT</Option>
          <Option value="放射">放射</Option>
        </Select>
      )
    );
  }, [type]);
  useEffect(() => {
    getSecMax();
  }, []);
  useEffect(() => {
    if (selectDate) {
      setDate(moment(selectDate));
      selectDate && onSearch(reConvertTime(selectDate));
    }
    return () => {
      setSelectIndex(-1);
      setCurrData([]);
    };
  }, [selectDate]);
  useEffect(() => {
    onSwitch && onSearch();
    return () => {
      setCurrData([]);
    };
  }, [reload, refresh]);
  const onSearch = async (selectDate?: string) => {
    setLoading(true);
    let url;
    if (!secName) {
      url = `${baseURL}/physical/arrangedCnt?date=${
        selectDate || date.format("YYYYMMDD")
      }`;
    } else if (secName === "全部") {
      url = `${baseURL}/physical/arrangedCnt?date=${
        selectDate || date.format("YYYYMMDD")
      }`;
    } else {
      url = `${baseURL}/physical/arrangedCnt?date=${
        selectDate || date.format("YYYYMMDD")
      }&secName=${secName}`;
    }
    const res: any = await getUrl(url, "GET");
    setLoading(false);

    let timelist = [
      "0800",
      "0900",
      "1000",
      "1100",
      "1400",
      "1430",
      "1530",
      "1630",
      "1730",
    ];
    const initData = timelist.map((value) => ({
      startTime: value,
      max: defaultMax,
      secName: type,
      cnt: 0,
    }));
    initData.forEach((item: any) => {
      res.data.forEach((i: any) => {
        if (item.startTime === i.time) {
          item.cnt = i.cnt;
        }
      });
    });
    initData.forEach((item: any) => {
      max.forEach((i: any) => {
        if (item.startTime === i.startTime) {
          item.max = i.max;
        }
      });
    });
    setCurrData(initData);
    onSelectTime(date, initData);
    // onSelectDate(moment(date).format("YYYYMMDD"));
  };
  const columns: any = useMemo(() => {
    if (type !== "带检查人") {
      return [
        {
          title: "预约时段",
          dataIndex: "startTime",
          key: "startTime",
          defaultSortOrder: "ascend",
          width: 120,
          sorter: (a: any, b: any) => a.startTime - b.startTime,
          render: (e: string, data: any) => {
            if (e.trim() === "-1") {
              return "全时间段";
            } else if (e === "0800") {
              return "08:00 - 09:00";
            } else if (e === "1400") {
              return "14:00 - 14:30";
            } else {
              const end = parseInt(e) + 100;
              return `${convertTime(e)} - ${convertTime(end + "")}`;
            }
          },
        },
        {
          title: "已约",
          dataIndex: "cnt",
          key: "cnt",
          width: 60,
        },
        {
          title: "限约",
          dataIndex: "max",
          key: "max",
          width: 60,
        },
      ];
    } else {
      return [
        {
          title: "预约时段",
          dataIndex: "startTime",
          key: "startTime",
          defaultSortOrder: "ascend",
          width: 120,
          sorter: (a: any, b: any) => a.startTime - b.startTime,
          render: (e: string, data: any) => {
            if (e.trim() === "-1") {
              return "全时间段";
            } else if (e === "0800") {
              return "08:00 - 09:00";
            } else if (e === "1400") {
              return "14:00 - 14:30";
            } else {
              const end = parseInt(e) + 100;
              return `${convertTime(e)} - ${convertTime(end + "")}`;
            }
          },
        },
        {
          title: "已约",
          dataIndex: "cnt",
          key: "cnt",
          width: 60,
        },
      ];
    }
  }, [type]);

  return (
    <div className="tableOne">
      <section style={{ marginBottom: 5, display: "flex" }}>
        <DatePicker
          format="YYYY-MM-DD"
          onChange={setDate}
          style={{ width: 150, marginRight: 10 }}
          value={date || moment(new Date())}
        />
        {selectInput}
        <Button
          type="primary"
          onClick={() => {
            setOnSwitch(true);
            setRefresh(!refresh);
            onSearch();
          }}
        >
          搜索
        </Button>
        <Button
          style={{ transform: "translateX(413px)" }}
          onClick={() => {
            eraseCookie("hos-cus-sec");
            eraseCookie("hos-cus");
            navigate(0);
          }}
        >
          注销
        </Button>
      </section>

      <Table
        style={{ width: 310 }}
        columns={columns}
        dataSource={currData}
        bordered
        loading={loading}
        size="middle"
        pagination={false}
        rowKey="startTime"
        onRow={(record: any, index: any) => ({
          onClick: () => {
            onSelectDateTime(date, record.startTime);
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
