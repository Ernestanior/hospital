import { Form, Row, Col, Input } from "antd";
import { useState } from "react";
import { fastRender, IRenderConfig } from "../fastRender";
import { SearchOutlined, SlidersOutlined } from "@ant-design/icons";
import { Btn } from "../button";
import { MedModal } from "components/modal";
interface IProps {
  searchList?: IRenderConfig[];
  onSearch: (value: {}) => void;
  primarySearch?: string;
}

export const Filter = ({ searchList, onSearch, primarySearch }: IProps) => {
  const [showMal, setModal] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const onFinish = (value: any) => {
    onSearch(value);
  };
  return (
    <div>
      <Input
        style={{ borderRadius: "15px", width: "250px", fontSize: "18px" }}
        onChange={(e) => setInputValue(e.currentTarget.value)}
        onPressEnter={() =>
          primarySearch && onSearch({ [primarySearch]: inputValue })
        }
        // onPressEnter={e=>onSearch({[primarySearch]:e.currentTarget.value })}
        prefix={
          <SearchOutlined
            onClick={() =>
              primarySearch && onSearch({ [primarySearch]: inputValue })
            }
          />
        }
        suffix={
          searchList && (
            <SlidersOutlined
              style={{
                backgroundColor: "#448ff7",
                padding: "5px 7px",
                borderRadius: "10px",
                color: "#fff",
              }}
              onClick={() => setModal(true)}
            />
          )
        }
      ></Input>

      <MedModal
        visible={showMal}
        onCancel={() => setModal(false)}
        onOk={(value) => {
          onSearch(value);
          setModal(false);
        }}
        footer={false}
        searchList={searchList}
      ></MedModal>
    </div>
  );
};
