import { FC, ReactElement, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sec from "pages/home/seclist";
import Cus from "pages/home/cuslist";

import { Tabs } from "antd";

const Index: FC = (): ReactElement => {
  const { TabPane } = Tabs;
  const navigator = useNavigate();
  const path: any = useLocation().state;
  const index = useMemo(() => (path && path.admin) || "customer", [path]);
  return (
    <div style={{ padding: 50 }}>
      <Tabs
        destroyInactiveTabPane
        activeKey={index}
        type="card"
        onChange={(activeKey) =>
          navigator(".", { state: { admin: activeKey } })
        }
      >
        <TabPane tab="用户管理" key="customer">
          <Cus />
        </TabPane>
        <TabPane tab="科室配置" key="section">
          <Sec />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Index;
