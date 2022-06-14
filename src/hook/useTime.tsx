import useBehaviorSubject from "components/template/hooks/useBehaviorSubject";
import { Moment } from "moment";
import { BehaviorSubject } from "rxjs";

const dateData = new BehaviorSubject<any>(null);
const timeData = new BehaviorSubject<any>(null);

export const onSelectTime = (date: Moment, data: any) => {
  // if (data.cnt >= data.max) {
  //   notification.error({
  //     message: "该时间段已达最大检查能力，请选择其他时间段",
  //   });
  //   return;
  // }
  dateData.next(`${date.format("YYYY-MM-DD")}`);
  timeData.next(data);
};

export const useTime = () => {
  return [useBehaviorSubject<any>(dateData), useBehaviorSubject<any>(timeData)];
};
