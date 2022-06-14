import useBehaviorSubject from "components/template/hooks/useBehaviorSubject";
import { BehaviorSubject } from "rxjs";

const dateData = new BehaviorSubject<any>(null);

export const onSelectDate = (date: any) => {
  dateData.next(date);
};

export const useDate = () => useBehaviorSubject<any>(dateData);
