import useBehaviorSubject from "components/template/hooks/useBehaviorSubject";
import { BehaviorSubject } from "rxjs";

const detail = new BehaviorSubject<any>(null);

export const onSelect = (data: any) => {
  detail.next(data);
};

export const useDetail = () => {
  return useBehaviorSubject<any>(detail);
};
