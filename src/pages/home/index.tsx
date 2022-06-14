import LeftTable from "./components/leftTable";
import RightTopTable from "./components/rightTopTable";
import RightBottomPart from "./components/rightBottomPart";
import { ConfigProvider } from "antd";
import zhCN from "antd/es/locale/zh_CN";
import { useState } from "react";

const Index = () => {
  const [refresh, setRefresh] = useState<boolean>(false);
  return (
    <ConfigProvider locale={zhCN}>
      <div style={{ display: "flex", minWidth: 1300 }}>
        <section style={{ flex: 3 }}>
          <LeftTable reload={refresh} />
        </section>
        <section style={{ flex: 4, display: "flex", flexDirection: "column" }}>
          <RightTopTable reload={() => setRefresh(!refresh)} />
          <RightBottomPart reload={refresh} />
        </section>
      </div>
    </ConfigProvider>
  );
};

export default Index;
