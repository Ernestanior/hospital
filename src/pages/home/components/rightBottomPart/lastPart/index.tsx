import { onSelectDate } from "hook/useDate";
import moment from "moment";
import { FC, useEffect, useState } from "react";
import { convertTime, TimePerDay } from "storage";
import { baseURL, getUrl } from "store/request";
import "./index.less";
// const today = +new Date()-TimePerDay;
const initDays: any[] = [];
for (let i = 0; i <= 6; i++) {
  initDays.push({
    checkDate: moment(+new Date() + i * TimePerDay).format("yyyyMMDD"),
    cnt: 0,
  });
}
interface IProps {
  reload: boolean;
}
const Index: FC<IProps> = ({ reload }) => {
  const [days, setDays] = useState(initDays);
  const [selectIndex, setSelectIndex] = useState(-1);
  const onSevenDays = async () => {
    const res: any = await getUrl(`${baseURL}/physical/sevenDays`);
    const newDays = [...initDays];
    res.data.length &&
      res.data.forEach((item: any) =>
        newDays.forEach(
          (i) => item.checkDate === i.checkDate && (i.cnt = item.cnt)
        )
      );
    setDays(newDays);
  };
  useEffect(() => {
    onSevenDays();
  }, [reload]);
  return (
    <section
      style={{ display: "flex", justifyContent: "center", marginTop: 20 }}
    >
      {days &&
        days.map((item: any, index: number) => (
          <div
            key={item.checkDate}
            className={index === selectIndex ? "active" : "non-active"}
            style={{
              padding: "5px 10px",
              marginRight: 10,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 10,
            }}
            onClick={() => {
              onSelectDate(item.checkDate);
              setSelectIndex(index);
            }}
          >
            <div>{convertTime(item.checkDate)}</div>
            <div style={{ fontWeight: 550, color: "#006eff" }}>{item.cnt}</div>
          </div>
        ))}
    </section>
  );
};

export default Index;
