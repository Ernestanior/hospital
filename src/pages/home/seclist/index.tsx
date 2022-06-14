import { Template } from "components/template";
import React, { FC, useState } from "react";
import { useLoading } from "components/loading";
import { Flag } from "storage";
import useEvent from "components/template/hooks/useEvent";
import { baseURL, getUrl } from "store/request";
import { EditOutlined } from "@ant-design/icons";
import EditList from "./editList";

const Content: FC = () => {
  const [flag, setFlag] = useState<Flag>(Flag.CLOSE);
  const [currData, setCurrData] = useState<any>();
  const [selectedData, setSelectedData] = useState<any>({});
  const [event$, sendMessage] = useEvent();
  const loading = useLoading();

  const TempConfig = {
    optList: [
      {
        text: "修改配置",
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
      const res: any = await getUrl(`${baseURL}/admin/secs`);
      const currData = res.data.map((item: string) => ({ secName: item }));
      setCurrData({
        // number: pageNum - 1,
        // numberOfElements: 0,
        // size: pageSize,
        // totalElements: size,
        // totalPages: size / pageNum,
        content: currData,
      });
    },
    rowId: "secName",
    data: currData,
    config: [
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
      <EditList
        onClose={() => setFlag(Flag.CLOSE)}
        reload={() => sendMessage("reload")}
        data={selectedData}
        visible={flag === Flag.EDIT}
        loading={loading}
      ></EditList>
    </>
  );
};

export default Content;
