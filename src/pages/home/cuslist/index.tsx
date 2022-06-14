import { Template } from "components/template";
import { FC, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import CreateDrawer from "./createDrawer";
import { useLoading } from "components/loading";
import { Flag } from "storage";
import useEvent from "components/template/hooks/useEvent";
import { baseURL, getUrl } from "store/request";
import { EditOutlined } from "@ant-design/icons";
import EditDrawer from "./editDrawer";
import { notification } from "antd";
const Content: FC = () => {
  const [flag, setFlag] = useState<Flag>(Flag.CLOSE);
  const [currData, setCurrData] = useState<any>();
  const [selectedData, setSelectedData] = useState<any>({});
  const [event$, sendMessage] = useEvent();
  const loading = useLoading();
  // const routerState: any = useLocation().state;
  // const type = useMemo(() => {
  //   return routerState && routerState.userMana;
  // }, [routerState]);

  const TempConfig = {
    optList: [
      {
        text: "修改密码",
        icon: (
          <a onClick={(e) => e.preventDefault()} href=".">
            <EditOutlined />
          </a>
        ),
        event: (data: any) => {
          setSelectedData(data);
          setFlag(Flag.EDIT);
        },
      },
    ],
    onSearch: async (params: any) => {
      // const { pageNum, pageSize } = params.searchPage;
      // const res = await request(adminApi.FindAdmin(pageNum, pageSize));
      const res: any = await getUrl(`${baseURL}/admin/users`);

      setCurrData({
        // number: pageNum - 1,
        // numberOfElements: 0,
        // size: pageSize,
        // totalElements: size,
        // totalPages: size / pageNum,
        content: res.data,
      });
    },
    normalBtns: [
      {
        text: "新增用户",
        onClick: () => {
          // setCreateFlag(true);
          setFlag(Flag.CREATE);
        },
      },
    ],
    rowId: "username",
    data: currData,
    config: [
      {
        title: "账号",
        dataIndex: "username",
        key: "username",
      },
      {
        title: "科室",
        dataIndex: "secName",
        key: "secName",
      },
    ],
  };
  return (
    <>
      <Template
        closeFilter
        primarySearch={"keyword"}
        {...TempConfig}
        event$={event$}
      ></Template>
      <CreateDrawer
        onClose={() => setFlag(Flag.CLOSE)}
        reload={() => sendMessage("reload")}
        visible={flag === Flag.CREATE}
        loading={loading}
      ></CreateDrawer>
      <EditDrawer
        onClose={() => setFlag(Flag.CLOSE)}
        reload={() => sendMessage("reload")}
        data={selectedData}
        visible={flag === Flag.EDIT}
        loading={loading}
      ></EditDrawer>
    </>
  );
};

export default Content;
