import { IFormComponent } from "../interface";
import { FC, useState, useMemo } from "react";
import { Checkbox, Col, Row } from "antd";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import { CheckboxValueType } from "antd/lib/checkbox/Group";
import "./checklist.less";
// import IntlDep from "../intl";

const CheckboxGroup = Checkbox.Group;

const CheckBoxListString: FC<
  IFormComponent & { enableAdd?: boolean; data: string[] }
> = ({ value, onChange, data, loader }) => {
  const checkedList = useMemo(() => {
    if (Array.isArray(value)) {
      return value;
    }
    if (typeof value !== "string" || value === "") {
      return [];
    }
    if (loader) {
      return loader(value);
    }
    return splitPlus(value, ",");
  }, [value, loader]);

  const [indeterminate, setIndeterminate] = useState(true);
  const [checkAll, setCheckAll] = useState(false);

  // 选项计算
  const allOptions: string[] = data;

  const changeEvent = (list: CheckboxValueType[]) => {
    const arr: any = list;
    if (onChange) {
      if (loader) {
        onChange(loader(arr));
      } else if (Array.isArray(value)) {
        onChange(list);
      } else {
        onChange(list.join(","));
      }
    }
    setIndeterminate(!!list.length && list.length < allOptions.length);
    setCheckAll(list.length === allOptions.length);
  };

  const onCheckAllChange = (e: CheckboxChangeEvent) => {
    changeEvent(e.target.checked ? allOptions : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };

  return (
    <Row className="comp-check-list">
      <Col span={5}>
        <Checkbox
          indeterminate={indeterminate}
          onChange={onCheckAllChange}
          checked={checkAll}
        >
          {/* <IntlDep id="SELECT_ALL" /> */}
          select all
        </Checkbox>
      </Col>
      <Col span={19} style={{ transform: "translate(-20px, 0)" }}>
        <CheckboxGroup
          options={allOptions}
          value={checkedList}
          onChange={changeEvent}
        />
      </Col>
    </Row>
  );
};

export default CheckBoxListString;
export const splitPlus = (
  value: string | undefined,
  tokenSeparators: string | string[]
) => {
  if (!value) {
    return [];
  }
  if (Array.isArray(value)) {
    return value as string[];
  }
  let text = value;
  if (Array.isArray(tokenSeparators) && tokenSeparators.length > 1) {
    const onlyToken = tokenSeparators[0];
    tokenSeparators.forEach((token, idx) => {
      if (idx === 0) return;
      text = text.split(token).join(onlyToken);
    });
  }
  const splitToken =
    typeof tokenSeparators === "string" ? tokenSeparators : tokenSeparators[0];
  const baseArr = text.split(splitToken);
  return formatterSubmitValue(baseArr) as string[];
};
export const formatterSubmitValue = (data: any) => {
  if (Array.isArray(data)) {
    const re = data.map(removeEmpty).filter((it) => !!it);
    return re;
  }
  return removeEmpty(data);
};
export const removeEmpty = (value: any) => {
  if (typeof value === "string") {
    return value.trim();
  }
  if (typeof value === "number") {
    return value;
  }
  // null， undefined 移除
  return null;
};
