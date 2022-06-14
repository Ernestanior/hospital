import { FC, useEffect, useMemo, useState } from "react";
import { Drawer, notification } from "antd";
import { baseURL, getUrl } from "store/request";
import { Template } from "components/template";
import { convertTime, Flag } from "storage";
import CreateDrawer from "./createDrawer";
import { useLoading } from "components/loading";
import { DeleteOutlined } from "@ant-design/icons";
// import EditDrawer from "./editDrawer";

interface IProps {
  visible: boolean;
  onClose: () => void;
  reload: () => void;
  loading: boolean;
  data: any;
}

const Index: FC<IProps> = ({ visible, onClose, reload, data }) => {
  const [flag, setFlag] = useState<Flag>(Flag.CLOSE);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [currData, setCurrData] = useState<any>([{ max: 13, time: "1400" }]);
  const loading = useLoading();

  const getSetting = async (secName: string) => {
    const res: any = await getUrl(`${baseURL}/admin/getConf/${secName}`);
    setCurrData({ content: res.data });
  };
  useEffect(() => {
    data.secName && getSetting(data.secName);
  }, [data.secName, refresh]);
  const TempConfig = useMemo(() => {
    return {
      optList: [
        {
          text: "删除",
          icon: (
            <a onClick={(e) => e.preventDefault()} href=".">
              <DeleteOutlined />
            </a>
          ),
          event: async (data: any) => {
            if (data.startTime === "-1") {
              notification.error({
                message: "全时间段一经创建，只能进行修改，无法删除",
              });
              return;
            }
            await getUrl(`${baseURL}/admin/delMax`, "DELETE", {
              secName: data.secName,
              time: data.startTime,
            });
            notification.success({
              message: "删除成功",
            });
            setRefresh(!refresh);
          },
        },
      ],
      normalBtns: [
        {
          text: "新增/修改检查能力",
          onClick: () => {
            // setCreateFlag(true);
            setFlag(Flag.CREATE);
          },
        },
      ],
      onSearch: async () => {
        // console.log(currData);
      },
      rowId: "startTime",
      data: currData,
      config: [
        {
          title: "时间段",
          dataIndex: "startTime",
          key: "startTime",
          render: (e: string) => {
            if (e.trim() === "-1") {
              return "全时间段";
            } else if (e === "1400") {
              return "1400 - 1430";
            } else {
              const end = parseInt(e) + 100;
              return `${convertTime(e)} - ${convertTime(end + "")}`;
            }
          },
        },
        {
          title: "最大检查能力",
          dataIndex: "max",
          key: "max",
        },
      ],
    };
  }, [currData]);
  return (
    <Drawer
      title="设置科室"
      placement="right"
      onClose={onClose}
      visible={visible}
      width={700}
      closable={false}
      getContainer={false}
    >
      <Template
        closeFilter
        primarySearch={"keyword"}
        {...TempConfig}
      ></Template>
      <CreateDrawer
        onClose={() => setFlag(Flag.CLOSE)}
        reload={() => {
          setRefresh(!refresh);
        }}
        visible={flag === Flag.CREATE}
        loading={loading}
        secName={data.secName}
      ></CreateDrawer>
      {/* <EditDrawer
        onClose={() => setFlag(Flag.CLOSE)}
        reload={() => sendMessage("reload")}
        data={selectedData}
        secName={data.secName}
        visible={flag === Flag.EDIT}
        loading={loading}
      ></EditDrawer> */}
    </Drawer>
  );
};

export default Index;
