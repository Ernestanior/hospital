import { FC, useMemo } from "react";
import { Select } from "antd";
const { Option } = Select;

interface IProps {
  start: string;
  end: string;
  total: string;
  hide: boolean;
  size: number;
  pageSizeChange?: (pageSize: number | undefined) => void;
}

const FooterDetail: FC<IProps> = ({
  start,
  end,
  total,
  hide,
  size,
  pageSizeChange,
}) => {
  function onChange(pageSize: string) {
    pageSizeChange && pageSizeChange(parseInt(pageSize));
  }
  const message = useMemo(
    () => (
      <>
        显示第{start}到第{end}条记录，共{total}条。每页显示 10 条
      </>
    ),
    [end, start, total]
  );
  return <div style={{ color: th, paddingLeft: 14 }}>{!hide && message}</div>;
};
export default FooterDetail;

const th = "#A7A7A7";
